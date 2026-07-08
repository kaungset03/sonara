// Library Service
use crate::{
    models::{folder::ImportResult, search::SearchResults},
    services::{metadata_service::SongMetadata, scan_service},
};

// insert user selected folder into the database and import its songs
// scan the folder for audio files, extract their metadata, and insert them into the database
pub fn add_folder(conn: &rusqlite::Connection, path: &str) -> rusqlite::Result<ImportResult> {
    let mut added = 0;
    let mut failed = 0;
    // insert the folder into the database
    let folder_id = crate::repositories::folder_repository::insert(conn, path)?;

    // scan the folder for audio files
    let audio_files = scan_service::scan_for_audio_files(path);

    // for each audio file, extract its metadata and insert it into the database
    for file in audio_files {
        let mut file_failed = false;

        match crate::services::metadata_service::extract_metadata(&file) {
            Ok(metadata) => {
                if let Err(e) = process_metadata(conn, metadata, folder_id, None) {
                    eprintln!("Process failed: {}", e);
                    file_failed = true;
                }
            }
            Err(e) => {
                eprintln!("Metadata failed: {}", e);
                file_failed = true;
            }
        }

        if file_failed {
            failed += 1;
        } else {
            added += 1;
        }
    }

    Ok(ImportResult {
        added,
        failed,
        removed: 0,
    })
}

// Re sync all the folders in the library and update their songs
pub fn resync_library(conn: &rusqlite::Connection) -> rusqlite::Result<ImportResult> {
    let mut added = 0;
    let mut failed = 0;
    let mut removed = 0;

    let folders = crate::repositories::folder_repository::index(conn)?;

    for folder in folders {
        let audio_files = scan_service::scan_for_audio_files(&folder.path);

        // songs in database for this folder
        let db_songs = crate::repositories::song_repository::get_by_folder(conn, folder.id)?;

        let songs_map = db_songs
            .into_iter()
            .map(|s| (s.path.clone(), s))
            .collect::<std::collections::HashMap<_, _>>();

        let scanned_set: std::collections::HashSet<String> = audio_files
            .iter()
            .map(|f| f.to_string_lossy().to_string())
            .collect();

        for file in &audio_files {
            let path = file.to_string_lossy();

            match songs_map.get(path.as_ref()) {
                None => match crate::services::metadata_service::extract_metadata(file) {
                    Ok(metadata) => {
                        if let Err(e) = process_metadata(conn, metadata, folder.id, None) {
                            eprintln!("Insert failed: {e}");
                            failed += 1;
                        } else {
                            added += 1;
                        }
                    }
                    Err(e) => {
                        eprintln!("Metadata failed: {e}");
                        failed += 1;
                    }
                },

                Some(existing) => match crate::services::metadata_service::extract_metadata(file) {
                    Ok(metadata) => {
                        if existing.file_modified_at != metadata.file_modified_at
                            || existing.file_size != metadata.file_size
                        {
                            if let Err(e) =
                                process_metadata(conn, metadata, folder.id, Some(existing.id))
                            {
                                eprintln!("Update failed: {e}");
                            }
                        }
                    }
                    Err(e) => {
                        eprintln!("Metadata failed: {e}");
                    }
                },
            }
        }

        // remove songs that are no longer in the folder
        for (path, existing) in songs_map {
            if !scanned_set.contains(&path) {
                if let Err(e) = crate::repositories::song_repository::delete(conn, existing.id) {
                    eprintln!("Delete failed: {e}");
                } else {
                    removed += 1;
                }
            }
        }
    }

    Ok(ImportResult {
        added,
        failed,
        removed,
    })
}

// get all folders in the library and their song count
pub fn get_all_folders(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::folder::Folder>> {
    crate::repositories::folder_repository::index(conn)
}

// delete a folder from the library and all its songs
pub fn remove_folder(conn: &rusqlite::Connection, folder_id: i64) -> rusqlite::Result<()> {
    // delete the folder
    crate::repositories::folder_repository::delete(conn, folder_id)
}

// get app stats
pub fn get_app_stats(
    app_handle: &tauri::AppHandle,
    conn: &rusqlite::Connection,
) -> rusqlite::Result<crate::models::stats::AppStats> {
    crate::repositories::folder_repository::app_stats(app_handle, conn)
}

// get home data
pub fn get_home_data(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<crate::models::stats::HomeData> {
    crate::repositories::folder_repository::home_data(conn)
}

pub fn preview_search(conn: &rusqlite::Connection, search: &str) -> Result<SearchResults, String> {
    let songs =
        crate::repositories::song_repository::search(conn, search).map_err(|e| e.to_string())?;
    let artists =
        crate::repositories::artist_repository::search(conn, search).map_err(|e| e.to_string())?;
    let albums =
        crate::repositories::album_repository::search(conn, search).map_err(|e| e.to_string())?;

    Ok(SearchResults {
        songs,
        artists,
        albums,
    })
}

// Clean up the library by removing empty artists and albums
pub fn cleanup_library(conn: &rusqlite::Connection) -> rusqlite::Result<String> {
    let deleted_albums = crate::repositories::album_repository::delete_empty_albums(conn)?;
    let deleted_artists = crate::repositories::artist_repository::delete_empty_artists(conn)?;
    let message = if deleted_albums == 0 && deleted_artists == 0 {
        "Nothing to clean.".to_string()
    } else {
        format!(
            "Removed {} unused albums and {} unused artists",
            deleted_albums, deleted_artists
        )
    };
    Ok(message)
}

fn process_metadata(
    conn: &rusqlite::Connection,
    metadata: SongMetadata,
    folder_id: i64,
    song_id: Option<i64>,
) -> Result<(), String> {
    // insert into artist table (find or create)
    let artist_id = crate::repositories::artist_repository::find_or_create(conn, &metadata.artist)
        .map_err(|e| e.to_string())?;

    let album_artist_id =
        crate::repositories::artist_repository::find_or_create(conn, &metadata.album_artist)
            .map_err(|e| e.to_string())?;

    // insert into album table (find or create)
    let album_id = crate::repositories::album_repository::find_or_create(
        conn,
        &metadata.album,
        album_artist_id,
    )
    .map_err(|e| e.to_string())?;

    if metadata.artist != "Unknown Artist" {
        crate::repositories::metadata_job_repository::create(
            conn,
            "artist",
            album_artist_id,
            "artist_image",
            0,
        )
        .map_err(|e| e.to_string())?;
    }

    if metadata.album_artist != "Unknown Artist" && album_artist_id != artist_id {
        crate::repositories::metadata_job_repository::create(
            conn,
            "artist",
            artist_id,
            "artist_image",
            0,
        )
        .map_err(|e| e.to_string())?;
    }

    // if album_name is not Unknown Album, create a metadata job to fetch the album cover
    if metadata.album != "Unknown Album" {
        crate::repositories::metadata_job_repository::create(
            conn,
            "album",
            album_id,
            "album_cover",
            3,
        )
        .map_err(|e| e.to_string())?;
    }

    if let Some(id) = song_id {
        crate::repositories::song_repository::update(
            conn,
            id,
            &metadata.title,
            metadata.duration,
            metadata.path.to_str().unwrap(),
            metadata.track_number,
            folder_id,
            album_id,
            artist_id,
            metadata.file_modified_at,
            metadata.file_size,
        )
        .map_err(|e| e.to_string())?;
    } else {
        // insert into song table
        crate::repositories::song_repository::create(
            conn,
            &metadata.title,
            metadata.duration,
            metadata.path.to_str().unwrap(),
            metadata.track_number,
            folder_id,
            album_id,
            artist_id,
            metadata.file_modified_at,
            metadata.file_size,
        )
        .map_err(|e| e.to_string())?;
    }

    Ok(())
}

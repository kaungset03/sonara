// Library Service

use crate::{
    models::folder::ImportResult,
    services::{artwork_service, scan_service},
};

// insert user selected folder into the database and import its songs
// This function will scan the folder for mp3 files, extract their metadata, and insert them into the database
pub fn add_folder(conn: &rusqlite::Connection, path: &str) -> rusqlite::Result<ImportResult> {
    let mut added = 0;
    let mut failed = 0;
    // insert the folder into the database
    let folder_id = crate::repositories::folder_repository::insert(conn, path)?;

    // scan the folder for mp3 files
    let mp3_files = scan_service::scan_for_mp3s(path);

    // for each mp3 file, extract its metadata and insert it into the database
    for file in mp3_files {
        match crate::services::metadata_service::extract_metadata(&file) {
            Ok(metadata) => {
                // insert into artist table and get artist_id (find or create)
                let artist_id =
                    crate::repositories::artist_repository::find_or_create(conn, &metadata.artist)?;

                // insert into album table and get album_id (find or create)
                let album_id = crate::repositories::album_repository::find_or_create(
                    conn,
                    &metadata.album,
                    artist_id,
                )?;

                // insert into song table
                crate::repositories::song_repository::create(
                    conn,
                    &metadata.title,
                    metadata.duration,
                    file.to_str().unwrap(),
                    metadata.track_number,
                    folder_id,
                    album_id,
                    artist_id,
                    metadata.file_modified_at,
                    metadata.file_size,
                )?;

                // Save the embedded artwork to a file and get the path
                let _ = artwork_service::process_album_artwork(
                    conn,
                    metadata.embedded_artwork,
                    album_id,
                );

                added += 1;
            }
            Err(e) => {
                eprintln!("Failed to read metadata from {}: {}", file.display(), e);
                failed += 1;
            }
        }
    }

    Ok(ImportResult {
        added,
        failed,
        removed: 0,
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

//TODO: Re scan the all folders in the library and update their songs

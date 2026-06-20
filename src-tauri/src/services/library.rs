use crate::{
    models::folder::ImportResult,
    repositories::{folder_repository, song_repository},
    services::{metadata::extract_metadata, scanner},
};

pub fn add_folder(conn: &rusqlite::Connection, path: &str) -> rusqlite::Result<ImportResult> {
    // insert the folder into the database
    let folder_id = folder_repository::insert_folder(conn, path)?;

    // scan the folder for files
    let files = scanner::scan_for_mp3s(path);

    let mut imported = 0;
    let mut skipped = 0;
    let mut failed = 0;

    for file in files {
        match extract_metadata(&file) {
            Ok(metadata) => {
                match song_repository::insert_song_metadata(
                    conn,
                    &metadata.title,
                    &metadata.artist,
                    &metadata.album,
                    &metadata.path,
                    if metadata.is_favorite { 1 } else { 0 },
                    metadata.favorite_added_at,
                    metadata.duration,
                    Some(folder_id),
                ) {
                    Ok(_) => imported += 1,

                    Err(rusqlite::Error::SqliteFailure(err, _))
                        if err.code == rusqlite::ErrorCode::ConstraintViolation =>
                    {
                        skipped += 1;
                    }

                    Err(e) => {
                        failed += 1;
                        eprintln!("Failed to insert {}: {}", metadata.path, e);
                    }
                }
            }

            Err(e) => {
                failed += 1;
                eprintln!("Failed to read metadata from {}: {}", file.display(), e);
            }
        }
    }

    Ok(ImportResult {
        imported,
        skipped,
        failed,
    })
}

pub fn get_home_data(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<crate::models::stats::HomeData> {
    let stats = song_repository::get_stats_query(conn)?;
    let recently_added_songs = song_repository::get_recently_added_songs_query(conn, 8)?;
    let most_played_songs = song_repository::get_most_played_songs_query(conn, 8)?;
    let recently_played_songs = song_repository::get_recently_played_songs_query(conn, 4)?;

    Ok(crate::models::stats::HomeData {
        stats,
        recently_added_songs,
        most_played_songs,
        recently_played_songs,
    })
}

// get all imported folders with their song counts
pub fn get_imported_folders(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::folder::Folder>> {
    folder_repository::get_all_folders_query(conn)
}

// remove library folder
pub fn remove_folder(conn: &rusqlite::Connection, id: i32) -> rusqlite::Result<()> {
    folder_repository::delete_folder_query(conn, id)
}

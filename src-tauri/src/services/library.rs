use crate::{
    repositories::{folder_repository, song_repository},
    services::{metadata::extract_metadata, scanner},
};

pub fn add_folder(conn: &rusqlite::Connection, path: &str) -> rusqlite::Result<()> {
    // insert the folder into the database
    // if successful, scan the folder for music files
    folder_repository::insert_folder(conn, path)?;

    // scan the folder for files
    let files = scanner::scan_for_mp3s(path);

    for file in files {
        // extract the metadata from the music file
        if let Ok(metadata) = extract_metadata(&file) {
            // insert the song into the database
            let _ = song_repository::insert_song_metadata(
                conn,
                &metadata.title,
                &metadata.artist,
                &metadata.album,
                &metadata.path,
                metadata.duration,
            );
        }
    }
    Ok(())
}

pub fn get_all_songs(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::song::Song>> {
    song_repository::get_all_songs_query(conn)
}

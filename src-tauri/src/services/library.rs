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
                if metadata.is_favorite { 1 } else { 0 },
                metadata.favorite_added_at,
                metadata.duration,
            );
        }
    }
    Ok(())
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

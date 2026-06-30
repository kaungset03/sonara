use crate::repositories::lyrics_repository;

// get song lyrics
pub fn get_song_lyrics(
    app: &tauri::AppHandle,
    conn: &rusqlite::Connection,
    song_id: i64,
) -> rusqlite::Result<Option<String>> {
    let lyrics = lyrics_repository::get_lyrics_by_song_id(conn, song_id)?;
    if let Some(lyrics) = lyrics {
        if !lyrics.path.is_none() {
            return Ok(lyrics.path);
        }
        if lyrics.status == "not_found" {
            return Ok(None);
        }
    }

    let song = crate::repositories::song_repository::get(conn, song_id)?;

    let lyrics_path = crate::services::file_service::ensure_song_lyrics(app, conn, &song)
        .map_err(|_| rusqlite::Error::InvalidQuery)?;
    Ok(lyrics_path)
}

pub fn update_song_lyrics(
    app: &tauri::AppHandle,
    conn: &rusqlite::Connection,
    song_id: i64,
    lyrics_path: &str,
) -> rusqlite::Result<()> {
    let saved_path = crate::services::file_service::save_file_to_app_data(
        app,
        lyrics_path.to_string(),
        format!("song_{}_lyrics.lrc", song_id),
    );

    if let Ok(saved_lyrics_path) = saved_path {
        lyrics_repository::update_lyrics_path(conn, song_id, &saved_lyrics_path, "found")
    } else {
        Err(rusqlite::Error::InvalidQuery)
    }
}

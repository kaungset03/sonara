use crate::repositories::song_repository;

pub fn get_all_songs(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::song::SongResponse>> {
    song_repository::index(conn)
}

pub fn get_song_by_id(
    conn: &rusqlite::Connection,
    id: i64,
) -> rusqlite::Result<crate::models::song::SongResponse> {
    song_repository::get(conn, id)
}

pub fn get_songs_by_search(
    conn: &rusqlite::Connection,
    query: &str,
) -> rusqlite::Result<Vec<crate::models::song::SongResponse>> {
    song_repository::search(conn, query)
}

pub fn set_favorite_song(
    conn: &rusqlite::Connection,
    song_id: i64,
    is_favorite: bool,
) -> rusqlite::Result<String> {
    song_repository::update_favorite_status(conn, song_id, is_favorite)
}

pub fn get_favorite_songs(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::song::SongResponse>> {
    song_repository::get_favorites(conn)
}

pub fn record_song_play(conn: &rusqlite::Connection, song_id: i64) -> rusqlite::Result<()> {
    song_repository::record_play(conn, song_id)
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
        song_repository::update_lyrics_path(conn, song_id, &saved_lyrics_path)
    } else {
        Err(rusqlite::Error::InvalidQuery)
    }
}

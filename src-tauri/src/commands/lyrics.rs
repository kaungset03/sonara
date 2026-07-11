use tauri::State;

use crate::{
    services::{self},
    DbState,
};

// get song lyrics path by song id
#[tauri::command]
pub async fn get_song_lyrics(
    app: tauri::AppHandle,
    song_id: i64,
) -> Result<Option<String>, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let bg_conn = crate::db::connection::get_connection(&app).map_err(|e| e.to_string())?;

        services::lyrics_service::get_song_lyrics(&bg_conn, song_id).map_err(|e| e.to_string())
    })
    .await
    .map_err(|e| format!("Thread execution failed: {}", e))?
}

// update song lyrics content
#[tauri::command]
pub fn update_song_lyrics(
    db: State<DbState>,
    song_id: i64,
    lyrics_content: String,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::lyrics_service::update_song_lyrics(&conn, song_id, &lyrics_content, "user")
        .map_err(|e| e.to_string())
}

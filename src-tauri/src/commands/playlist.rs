use tauri::State;

use crate::{
    services::{self},
    DbState,
};

// get playlists
#[tauri::command]
pub fn get_all_playlists(
    db: State<DbState>,
) -> Result<Vec<crate::models::playlist::Playlist>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::playlist_service::get_all_playlists(&conn).map_err(|e| e.to_string())
}

// get single playlist details
#[tauri::command]
pub fn get_playlist_details(
    db: State<DbState>,
    playlist_id: i64,
) -> Result<crate::models::playlist::PlaylistDetails, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::playlist_service::get_playlist_details(&conn, playlist_id).map_err(|e| e.to_string())
}

// create new playlist
#[tauri::command]
pub fn create_playlist(db: State<DbState>, name: String) -> Result<i64, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::playlist_service::create_playlist(&conn, &name).map_err(|e| e.to_string())
}

// edit playlist
#[tauri::command]
pub fn edit_playlist(db: State<DbState>, playlist_id: i64, new_name: String) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::playlist_service::edit_playlist(&conn, playlist_id, &new_name)
        .map_err(|e| e.to_string())
}

// delete playlist
#[tauri::command]
pub fn delete_playlist(db: State<DbState>, playlist_id: i64) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::playlist_service::delete_playlist(&conn, playlist_id).map_err(|e| e.to_string())
}

// add songs to playlist
#[tauri::command]
pub fn add_songs_to_playlist(
    db: State<DbState>,
    playlist_id: i64,
    song_ids: Vec<i64>,
) -> Result<crate::models::playlist::AddSongsResult, String> {
    let mut conn = db.0.lock().map_err(|e| e.to_string())?;
    let result =
        services::playlist_service::add_songs_to_playlist(&mut conn, playlist_id, &song_ids)
            .map_err(|e| e.to_string())?;
    Ok(result)
}

// remove song from playlist
#[tauri::command]
pub fn remove_songs_from_playlist(
    db: State<DbState>,
    playlist_id: i64,
    song_ids: Vec<i64>,
) -> Result<(), String> {
    let mut conn = db.0.lock().map_err(|e| e.to_string())?;
    services::playlist_service::remove_song_from_playlist(&mut conn, playlist_id, &song_ids)
        .map_err(|e| e.to_string())
}

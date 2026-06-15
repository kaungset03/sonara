use tauri::State;

use crate::{
    services::{self},
    DbState,
};

#[tauri::command]
pub fn add_library_folder(db: State<DbState>, path: String) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    services::library::add_folder(&conn, &path).map_err(|e| e.to_string())
}

// get all the songs
#[tauri::command]
pub fn get_all_songs(db: State<DbState>) -> Result<Vec<crate::models::song::Song>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    services::song::get_all_songs(&conn).map_err(|e| e.to_string())
}

// get all the artists
#[tauri::command]
pub fn get_all_artists(db: State<DbState>) -> Result<Vec<crate::models::artist::Artist>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::song::get_all_artists(&conn).map_err(|e| e.to_string())
}

// get all the albums
#[tauri::command]
pub fn get_all_albums(db: State<DbState>) -> Result<Vec<crate::models::album::Album>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::song::get_all_albums(&conn).map_err(|e| e.to_string())
}

// get songs by artist
#[tauri::command]
pub fn get_songs_by_artist(
    db: State<DbState>,
    artist: String,
) -> Result<Vec<crate::models::song::Song>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::song::get_songs_by_artist(&conn, &artist).map_err(|e| e.to_string())
}

// get songs by album
#[tauri::command]
pub fn get_songs_by_album(
    db: State<DbState>,
    album: String,
) -> Result<Vec<crate::models::song::Song>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::song::get_songs_by_album(&conn, &album).map_err(|e| e.to_string())
}

// set favorite song
#[tauri::command]
pub fn set_favorite_song(
    db: State<DbState>,
    song_id: i32,
    is_favorite: bool,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let result =
        services::song::set_favorite_song(&conn, song_id, is_favorite).map_err(|e| e.to_string());
    result
}

// get favorite songs
#[tauri::command]
pub fn get_favorite_songs(db: State<DbState>) -> Result<Vec<crate::models::song::Song>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::song::get_favorite_songs(&conn).map_err(|e| e.to_string())
}

// create new playlist
#[tauri::command]
pub fn create_playlist(db: State<DbState>, name: String) -> Result<i64, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::playlist::create_playlist(&conn, &name).map_err(|e| e.to_string())
}

// get all playlists
#[tauri::command]
pub fn get_all_playlists(
    db: State<DbState>,
) -> Result<Vec<crate::models::playlist::Playlist>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::playlist::get_all_playlists(&conn).map_err(|e| e.to_string())
}

// edit playlist
#[tauri::command]
pub fn edit_playlist(db: State<DbState>, playlist_id: i64, new_name: String) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::playlist::edit_playlist(&conn, playlist_id, &new_name).map_err(|e| e.to_string())
}

// delete playlist
#[tauri::command]
pub fn delete_playlist(db: State<DbState>, playlist_id: i64) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::playlist::delete_playlist(&conn, playlist_id).map_err(|e| e.to_string())
}

// get songs by playlist
#[tauri::command]
pub fn get_songs_by_playlist(
    db: State<DbState>,
    playlist_id: i64,
) -> Result<crate::models::playlist::PlaylistDetails, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::playlist::get_songs_by_playlist(&conn, playlist_id).map_err(|e| e.to_string())
}

// add new song to playlist
#[tauri::command]
pub fn add_song_to_playlist(
    db: State<DbState>,
    playlist_id: i64,
    song_ids: Vec<i64>,
) -> Result<(), String> {
    let mut conn = db.0.lock().map_err(|e| e.to_string())?;
    services::playlist::add_songs_to_playlist(&mut conn, playlist_id, &song_ids)
        .map_err(|e| e.to_string())
}

// remove song from playlist
#[tauri::command]
pub fn remove_song_from_playlist(
    db: State<DbState>,
    playlist_id: i64,
    song_id: i64,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::playlist::remove_song_from_playlist(&conn, playlist_id, song_id)
        .map_err(|e| e.to_string())
}

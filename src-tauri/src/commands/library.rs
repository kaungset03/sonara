use tauri::State;

use crate::{
    services::{self},
    DbState,
};

// user select a folder,
// we insert the folder into the database and then scan it for music files
// extract the metadata from the music files and insert them into the database
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

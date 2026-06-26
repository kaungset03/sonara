use tauri::State;

use crate::{
    services::{self},
    DbState,
};

// get all artists
#[tauri::command]
pub fn get_all_artists(db: State<DbState>) -> Result<Vec<crate::models::artist::Artist>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::artist_service::get_all_artists(&conn).map_err(|e| e.to_string())
}

// get artist details (info + songs)
#[tauri::command]
pub fn get_artist_details(
    db: State<DbState>,
    artist_id: i64,
) -> Result<crate::models::artist::ArtistDetails, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::artist_service::get_artist_details(&conn, artist_id).map_err(|e| e.to_string())
}

// update profile picture
#[tauri::command]
pub fn update_artist_image(
    db: State<DbState>,
    artist_id: i64,
    image_path: &str,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::artist_service::update_artist_image(&conn, artist_id, image_path)
        .map_err(|e| e.to_string())
}

use tauri::State;

use crate::{
    services::{self},
    DbState,
};

// get all albums
#[tauri::command]
pub fn get_all_albums(
    db: State<DbState>,
    sort_col: Option<String>,
    order_direction: Option<String>,
) -> Result<Vec<crate::models::album::Album>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let sort_col = sort_col.as_deref().unwrap_or("name");
    let order_direction = order_direction.as_deref().unwrap_or("asc");

    services::album_service::get_all_albums(&conn, sort_col, order_direction)
        .map_err(|e| e.to_string())
}

// get album details (info + songs)
#[tauri::command]
pub fn get_album_details(
    db: State<DbState>,
    album_id: i64,
) -> Result<crate::models::album::AlbumDetails, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::album_service::get_album_details(&conn, album_id).map_err(|e| e.to_string())
}

// search albums by name
#[tauri::command]
pub fn search_albums(
    db: State<DbState>,
    search: &str,
) -> Result<Vec<crate::models::search::LiveSearchResult>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::album_service::search_albums(&conn, search).map_err(|e| e.to_string())
}

// update album cover
#[tauri::command]
pub fn update_album_cover(
    app: tauri::AppHandle,
    db: State<DbState>,
    album_id: i64,
    image_path: &str,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::album_service::update_album_cover(&app, &conn, album_id, image_path)
        .map_err(|e| e.to_string())
}

use serde_json::json;
use tauri::State;
use tauri_plugin_store::StoreExt;

use crate::{
    services::{self},
    DbState,
};

#[tauri::command]
pub fn add_library_folder(db: State<DbState>, path: String) -> Result<String, String> {
    let mut conn = db.0.lock().map_err(|e| e.to_string())?;

    let import_result =
        services::library_service::add_folder(&mut conn, &path).map_err(|e| e.to_string())?;
    Ok(import_result)
}

// sync library folders - re-scan the folders and update the songs in the database
#[tauri::command]
pub fn sync_library_folders(db: State<DbState>) -> Result<String, String> {
    let mut conn = db.0.lock().map_err(|e| e.to_string())?;
    services::library_service::resync_library(&mut conn).map_err(|e| e.to_string())
}

// get all imported folders with their song counts
#[tauri::command]
pub fn get_imported_folders(
    db: State<DbState>,
) -> Result<Vec<crate::models::folder::Folder>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::library_service::get_all_folders(&conn).map_err(|e| e.to_string())
}

// remove library folder
#[tauri::command]
pub fn remove_library_folder(db: State<DbState>, id: i64) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::library_service::remove_folder(&conn, id).map_err(|e| e.to_string())
}

// stats and data for home page
#[tauri::command]
pub fn get_home_data(db: State<DbState>) -> Result<crate::models::stats::HomeData, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::library_service::get_home_data(&conn).map_err(|e| e.to_string())
}

// App stats for settings page
#[tauri::command]
pub fn get_app_stats(
    app_handle: tauri::AppHandle,
    db: State<DbState>,
) -> Result<crate::models::stats::AppStats, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::library_service::get_app_stats(&app_handle, &conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn search_library(
    db: State<DbState>,
    search: String,
) -> Result<crate::models::search::SearchResults, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::library_service::preview_search(&conn, &search).map_err(|e| e.to_string())
}

// clean up library by removing empty artists and albums
#[tauri::command]
pub fn cleanup_library(db: State<DbState>) -> Result<String, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    services::library_service::cleanup_library(&conn).map_err(|e| e.to_string())
}

// read app config from app.config.json
#[tauri::command]
pub fn get_app_config(app_handle: tauri::AppHandle) -> Result<serde_json::Value, String> {
    let config_store = app_handle
        .store("app.config.json")
        .map_err(|e| e.to_string())?;
    let config = config_store
        .get("app-config")
        .unwrap_or(serde_json::Value::Object(serde_json::Map::new()));

    Ok(config)
}

// update app config in app.config.json
#[tauri::command]
pub fn update_app_config(
    app_handle: tauri::AppHandle,
    auto_download_enabled: bool,
) -> Result<(), String> {
    let config_store = app_handle
        .store("app.config.json")
        .map_err(|e| e.to_string())?;
    config_store.set(
        "app-config",
        json!({ "auto_download_enabled": auto_download_enabled }),
    );

    Ok(())
}

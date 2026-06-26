// use tauri::State;

// use crate::{
//     models::folder::ImportResult,
//     services::{self},
//     DbState,
// };

// #[tauri::command]
// pub fn add_library_folder(db: State<DbState>, path: String) -> Result<ImportResult, String> {
//     let conn = db.0.lock().map_err(|e| e.to_string())?;

//     let import_result = services::library::add_folder(&conn, &path).map_err(|e| e.to_string())?;
//     Ok(import_result)
// }

// // sync library folders - re-scan the folders and update the songs in the database
// #[tauri::command]
// pub fn sync_library_folders(db: State<DbState>) -> Result<ImportResult, String> {
//     let conn = db.0.lock().map_err(|e| e.to_string())?;
//     services::library::sync_library(&conn).map_err(|e| e.to_string())
// }

// // get all imported folders with their song counts
// #[tauri::command]
// pub fn get_imported_folders(
//     db: State<DbState>,
// ) -> Result<Vec<crate::models::folder::Folder>, String> {
//     let conn = db.0.lock().map_err(|e| e.to_string())?;
//     services::library::get_imported_folders(&conn).map_err(|e| e.to_string())
// }

// // remove library folder
// #[tauri::command]
// pub fn remove_library_folder(db: State<DbState>, id: i64) -> Result<(), String> {
//     let conn = db.0.lock().map_err(|e| e.to_string())?;
//     services::library::remove_folder(&conn, id).map_err(|e| e.to_string())
// }

// // get all the artists
// #[tauri::command]
// pub fn get_all_artists(db: State<DbState>) -> Result<Vec<crate::models::artist::Artist>, String> {
//     let conn = db.0.lock().map_err(|e| e.to_string())?;
//     services::song_service::get_all_artists(&conn).map_err(|e| e.to_string())
// }

// // get all the albums
// #[tauri::command]
// pub fn get_all_albums(db: State<DbState>) -> Result<Vec<crate::models::album::Album>, String> {
//     let conn = db.0.lock().map_err(|e| e.to_string())?;
//     services::song_service::get_all_albums(&conn).map_err(|e| e.to_string())
// }

// // get songs by artist
// #[tauri::command]
// pub fn get_songs_by_artist(
//     db: State<DbState>,
//     artist: String,
// ) -> Result<Vec<crate::models::song::Song>, String> {
//     let conn = db.0.lock().map_err(|e| e.to_string())?;
//     services::song_service::get_songs_by_artist(&conn, &artist).map_err(|e| e.to_string())
// }

// // get songs by album
// #[tauri::command]
// pub fn get_songs_by_album(
//     db: State<DbState>,
//     album: String,
// ) -> Result<Vec<crate::models::song::Song>, String> {
//     let conn = db.0.lock().map_err(|e| e.to_string())?;
//     services::song_service::get_songs_by_album(&conn, &album).map_err(|e| e.to_string())
// }

// // stats and data for home page
// #[tauri::command]
// pub fn get_home_data(db: State<DbState>) -> Result<crate::models::stats::HomeData, String> {
//     let conn = db.0.lock().map_err(|e| e.to_string())?;
//     services::library::get_home_data(&conn).map_err(|e| e.to_string())
// }

// // App stats for settings page
// #[tauri::command]
// pub fn get_app_stats(
//     app_handle: tauri::AppHandle,
//     db: State<DbState>,
// ) -> Result<crate::models::stats::AppStats, String> {
//     let conn = db.0.lock().map_err(|e| e.to_string())?;
//     services::library::get_app_stats(&app_handle, &conn).map_err(|e| e.to_string())
// }

// // search songs, artists, and albums
// #[tauri::command]
// pub fn search_library(
//     db: State<DbState>,
//     search: String,
// ) -> Result<crate::models::search::SearchResults, String> {
//     let conn = db.0.lock().map_err(|e| e.to_string())?;
//     services::search::preview_search_results(&conn, &search).map_err(|e| e.to_string())
// }

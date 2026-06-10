use tauri::State;

use crate::{services::library, DbState};

// user select a folder,
// we insert the folder into the database and then scan it for music files
// extract the metadata from the music files and insert them into the database
#[tauri::command]
pub fn add_library_folder(db: State<DbState>, path: String) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    library::add_folder(&conn, &path).map_err(|e| e.to_string())
}

// get all the songs
#[tauri::command]
pub fn get_all_songs(db: State<DbState>) -> Result<Vec<crate::models::song::Song>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    library::get_all_songs(&conn).map_err(|e| e.to_string())
}

use tauri::State;

use crate::{services::library, DbState};

#[tauri::command]
pub fn add_library_folder(db: State<DbState>, path: String) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    library::add_folder(&conn, &path).map_err(|e| e.to_string())
}

mod db;
use db::{connection::get_connection, migrations::run_migrations};
use std::sync::Mutex;
use tauri::Manager;

pub struct DbState(pub Mutex<rusqlite::Connection>);

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Save folder path to the database
#[tauri::command]
fn add_library_folder(db: tauri::State<DbState>, path: String) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO library_folders (path, created_at) VALUES (?1, datetime('now'))",
        &[&path],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

// Get saved library folders from the database
#[tauri::command]
fn get_library_folders(db: tauri::State<DbState>) -> Result<Vec<String>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT path FROM library_folders")
        .map_err(|e| e.to_string())?;
    let folder_iter = stmt
        .query_map([], |row| row.get(0))
        .map_err(|e| e.to_string())?;

    let mut folders = Vec::new();
    for folder in folder_iter {
        folders.push(folder.map_err(|e| e.to_string())?);
    }
    Ok(folders)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        // 2. Use the setup hook to initialize the database
        .setup(|app: &mut tauri::App| {
            let conn = get_connection(app.handle()).expect("Failed to connect to the database");
            run_migrations(&conn).expect("Failed to run database migrations");

            app.manage(DbState(Mutex::new(conn)));

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, add_library_folder, get_library_folders])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

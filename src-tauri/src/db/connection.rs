use rusqlite::Connection;
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

pub fn get_connection(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error> {
    let db_path: PathBuf = if cfg!(debug_assertions) {
        // Save in the project root directory
        let current_dir = std::env::current_dir().expect("Failed to get current dir");
        current_dir.join("dev_database.db")
    } else {
        // Save in the proper system Application Data folder
        let app_dir = app_handle
            .path()
            .app_data_dir()
            .expect("Failed to get app data directory");
        fs::create_dir_all(&app_dir).expect("Failed to create app data directory");
        app_dir.join("app_database.db")
    };

    Connection::open(db_path)
}

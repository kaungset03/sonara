mod commands;
mod db;
mod models;
mod repositories;
mod services;

use commands::library::*;
use db::{connection::get_connection, migrations::run_migrations};
use std::sync::Mutex;
use tauri::Manager;

pub struct DbState(pub Mutex<rusqlite::Connection>);

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_dialog::init())
        // 2. Use the setup hook to initialize the database
        .setup(|app: &mut tauri::App| {
            let conn = get_connection(app.handle()).expect("Failed to connect to the database");
            run_migrations(&conn).expect("Failed to run database migrations");

            app.manage(DbState(Mutex::new(conn)));

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            add_library_folder,
            sync_library_folders,
            get_imported_folders,
            remove_library_folder,
            get_all_songs,
            get_song_by_id,
            get_all_artists,
            get_all_albums,
            get_songs_by_artist,
            get_songs_by_album,
            set_favorite_song,
            get_favorite_songs,
            create_playlist,
            get_all_playlists,
            edit_playlist,
            delete_playlist,
            get_songs_by_playlist,
            add_songs_to_playlist,
            remove_song_from_playlist,
            get_home_data,
            record_song_play,
            search_library,
            update_song_lyrics_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

mod commands;
mod db;
mod models;
mod repositories;
mod services;

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
            commands::library::add_library_folder,
            commands::library::sync_library_folders,
            commands::library::get_imported_folders,
            commands::library::remove_library_folder,
            commands::library::search_library,
            commands::library::get_home_data,
            commands::library::get_app_stats,
            commands::song::get_all_songs,
            commands::song::get_song_by_id,
            commands::song::get_songs_by_search,
            commands::song::get_favorite_songs,
            commands::song::update_song_metadata,
            commands::song::set_favorite_song,
            commands::song::record_song_play,
            commands::lyrics::get_song_lyrics,
            commands::lyrics::update_song_lyrics,
            commands::playlist::get_all_playlists,
            commands::playlist::get_playlist_details,
            commands::playlist::create_playlist,
            commands::playlist::edit_playlist,
            commands::playlist::delete_playlist,
            commands::playlist::add_songs_to_playlist,
            commands::playlist::remove_songs_from_playlist,
            commands::artist::get_all_artists,
            commands::artist::get_artist_details,
            commands::artist::update_artist_image,
            commands::album::get_all_albums,
            commands::album::get_album_details,
            commands::album::update_album_cover,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

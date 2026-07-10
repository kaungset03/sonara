mod commands;
mod db;
mod models;
mod repositories;
mod services;

use db::{connection::get_connection, migrations::run_migrations};
use std::{sync::Mutex, time::Duration};
use tauri::Manager;
use tauri_plugin_store::StoreExt;

use crate::services::metadata_job_service::process_pending_jobs;

pub struct DbState(pub Mutex<rusqlite::Connection>);

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app: &mut tauri::App| {
            let conn = get_connection(app.handle()).expect("Failed to connect to the database");
            run_migrations(&conn).expect("Failed to run database migrations");

            app.manage(DbState(Mutex::new(conn)));

            let app_handle = app.handle().clone();

            tauri::async_runtime::spawn_blocking(move || {
                let bg_conn = match crate::db::connection::get_connection(&app_handle) {
                    Ok(conn) => conn,
                    Err(err) => {
                        eprintln!("Failed to open background database connection: {err}");
                        return;
                    }
                };

                let config_store = match app_handle.store("app.config.json") {
                    Ok(store) => store,
                    Err(err) => {
                        eprintln!("Failed to load store: {err}");
                        return;
                    }
                };

                loop {
                    let app_config = match config_store.get("app-config") {
                        Some(config) => config,
                        None => {
                            // First launch, create default config
                            let default_config = serde_json::json!({
                                "auto_download_enabled": false
                            });

                            config_store.set("app-config", default_config.clone());

                            default_config
                        }
                    };

                    if app_config["auto_download_enabled"]
                        .as_bool()
                        .unwrap_or(false)
                    {
                        if let Err(err) = process_pending_jobs(&bg_conn, &app_handle, 3) {
                            eprintln!("Error processing pending jobs: {err}");
                        }
                    }

                    std::thread::sleep(Duration::from_secs(10));
                }
            });

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            commands::library::add_library_folder,
            commands::library::sync_library_folders,
            commands::library::get_imported_folders,
            commands::library::remove_library_folder,
            commands::library::cleanup_library,
            commands::library::search_library,
            commands::library::get_home_data,
            commands::library::get_app_stats,
            commands::library::get_app_config,
            commands::library::update_app_config,
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
            commands::artist::search_artists,
            commands::artist::update_artist_image,
            commands::album::get_all_albums,
            commands::album::get_album_details,
            commands::album::search_albums,
            commands::album::update_album_cover,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

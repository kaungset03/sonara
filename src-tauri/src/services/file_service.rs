use reqwest::blocking::Client;
use serde_json::Value;
use std::fs;
use tauri::{AppHandle, Manager};

// save file to app data
pub fn save_file_to_app_data(
    app_handle: &AppHandle,
    source_path: String,
    file_name: String,
) -> Result<String, String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get AppData directory: {}", e))?;

    if !app_data_dir.exists() {
        fs::create_dir_all(&app_data_dir)
            .map_err(|e| format!("Failed to create AppData directory: {}", e))?;
    }

    let src = std::path::Path::new(&source_path);
    let dest = app_data_dir.join(&file_name);

    fs::copy(&src, &dest)
        .map_err(|e| format!("Failed to copy file from {:?} to {:?}: {}", src, dest, e))?;

    Ok(dest.to_string_lossy().into_owned())
}

// get cover art from music brain api
fn get_cover_art_from_music_brainz(artist: &str, album: &str) -> Result<String, String> {
    let client = Client::new();

    let query = format!("artist:\"{}\" AND release:\"{}\"", artist, album);

    let url = format!(
        "https://musicbrainz.org/ws/2/release/?query={}&fmt=json",
        urlencoding::encode(&query)
    );

    let mb_json: Value = client
        .get(&url)
        .header("User-Agent", "Sonara/0.1.0 (kset2299@gmail.com)")
        .send()
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?
        .json()
        .map_err(|e| e.to_string())?;

    let mbid = mb_json["releases"]
        .as_array()
        .and_then(|releases| releases.first())
        .and_then(|release| release.get("id"))
        .and_then(|id| id.as_str())
        .ok_or("No valid release MBID found")?;

    Ok(format!(
        "https://coverartarchive.org/release/{}/front-250",
        mbid
    ))
}

// download and save cover art to app data
fn download_and_save_cover(
    url: &str,
    file_name: String,
    app_handle: &AppHandle,
) -> Result<String, String> {
    let client = reqwest::blocking::Client::new();

    let bytes = client
        .get(url)
        .send()
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?
        .bytes()
        .map_err(|e| e.to_string())?;

    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get AppData directory: {}", e))?;

    if !app_data_dir.exists() {
        fs::create_dir_all(&app_data_dir)
            .map_err(|e| format!("Failed to create AppData directory: {}", e))?;
    }
    let dest = app_data_dir.join(&file_name);

    fs::write(&dest, &bytes).map_err(|e| e.to_string())?;

    Ok(dest.to_string_lossy().to_string())
}

// ensure album cover
pub fn ensure_album_cover(
    conn: &rusqlite::Connection,
    app_handle: &AppHandle,
    album_id: i64,
) -> Result<Option<String>, String> {
    let album =
        crate::repositories::album_repository::get(conn, album_id).map_err(|e| e.to_string())?;

    if let Some(path) = &album.cover_path {
        return Ok(Some(path.clone()));
    }

    let cover_url = get_cover_art_from_music_brainz(&album.artist_name, &album.name)?;

    let saved_path = download_and_save_cover(
        &cover_url,
        format!("album_{}_cover.jpg", album_id),
        app_handle,
    )?;

    crate::repositories::album_repository::update_cover_path(conn, album_id, &saved_path)
        .map_err(|e| e.to_string())?;

    Ok(Some(saved_path))
}

use reqwest::blocking::Client;
use serde_json::Value;
use std::fs;
use tauri::{AppHandle, Manager};

use crate::models::{album::Album, artist::Artist, song::SongResponse};

// save user selected local file to app data
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
fn get_cover_art_from_music_brainz(artist: &str, album: &str) -> Result<Option<String>, String> {
    let client = Client::new();

    let query = format!("artist:\"{}\" AND release:\"{}\"", artist, album);

    let url = format!(
        "https://musicbrainz.org/ws/2/release/?query={}&fmt=json",
        urlencoding::encode(&query)
    );

    let mb_json: Value = client
        .get(&url)
        .header(
            "User-Agent",
            "Sonara/0.1.0 (https://github.com/kaungset03/sonara)",
        )
        .send()
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?
        .json()
        .map_err(|e| e.to_string())?;

    let Some(mbid) = mb_json["releases"]
        .as_array()
        .and_then(|releases| releases.first())
        .and_then(|release| release.get("id"))
        .and_then(|id| id.as_str())
    else {
        return Ok(None);
    };

    let cover_art_url = format!("https://coverartarchive.org/release/{}/front", mbid);
    Ok(Some(cover_art_url))
}

// get artist image from audio db api
fn get_artist_image_from_audio_db(artist: &str) -> Result<Option<String>, String> {
    let client = Client::new();

    let url = format!(
        "https://theaudiodb.com/api/v1/json/2/search.php?s={}",
        urlencoding::encode(artist)
    );

    let audio_db_json: Value = client
        .get(&url)
        .send()
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?
        .json()
        .map_err(|e| e.to_string())?;

    let Some(image_url) = audio_db_json["artists"]
        .as_array()
        .and_then(|artists| artists.first())
        .and_then(|artist| artist.get("strArtistThumb"))
        .and_then(|thumb| thumb.as_str())
    else {
        return Ok(None);
    };

    Ok(Some(image_url.to_string()))
}

pub fn get_song_lyrics_from_lrclib(song: &SongResponse) -> Result<Option<String>, String> {
    // Implementation for fetching lyrics from LRCLib
    let client = Client::new();

    let url = format!(
        "https://lrclib.net/api/get?artist_name={}&track_name={}&album_name={}&duration={}",
        urlencoding::encode(&song.artist_name),
        urlencoding::encode(&song.title),
        urlencoding::encode(&song.album_name),
        song.duration
    );

    let response = client.get(&url).send().map_err(|e| e.to_string())?;

    if response.status() == reqwest::StatusCode::NOT_FOUND {
        return Ok(None);
    }

    let response = response.error_for_status().map_err(|e| e.to_string())?;

    let lrclib_json: Value = response.json().map_err(|e| e.to_string())?;

    let Some(lyrics) = lrclib_json["syncedLyrics"].as_str() else {
        return Ok(None);
    };

    Ok(Some(lyrics.to_string()))
}

// download and save file to app data
fn download_and_save_file(
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
    album: Album,
) -> Result<Option<String>, String> {
    // if cover_path exists, return it
    if album.cover_path.is_some() {
        return Ok(album.cover_path);
    }

    // already tried to fetch and not found, return None
    if album.cover_status == "not_found" {
        return Ok(None);
    }

    match get_cover_art_from_music_brainz(&album.artist_name, &album.name) {
        Ok(Some(url)) => {
            // Download and save
            let saved_path =
                download_and_save_file(&url, format!("album_{}_cover.jpg", album.id), app_handle)?;

            crate::repositories::album_repository::update_cover_path(
                conn,
                album.id,
                &saved_path,
                "found",
            )
            .map_err(|e| e.to_string())?;

            return Ok(Some(saved_path));
        }
        Ok(None) => {
            crate::repositories::album_repository::update_cover_status(conn, album.id, "not_found")
                .map_err(|e| e.to_string())?;
            return Ok(None);
        }
        Err(err) => {
            // Network error or other error, log and return error
            return Err(err);
        }
    }
}

pub fn ensure_artist_image(
    conn: &rusqlite::Connection,
    app_handle: &AppHandle,
    artist: Artist,
) -> Result<Option<String>, String> {
    if let Some(path) = &artist.image_path {
        return Ok(Some(path.clone()));
    }

    // if image_status == "not_found", return None
    if artist.image_status == "not_found" {
        return Ok(None);
    }

    match get_artist_image_from_audio_db(&artist.name) {
        Ok(Some(url)) => {
            // Download and save
            let saved_path = download_and_save_file(
                &url,
                format!("artist_{}_image.jpg", artist.id),
                app_handle,
            )?;
            crate::repositories::artist_repository::update_image_path(conn, artist.id, &saved_path)
                .map_err(|e| e.to_string())?;
            return Ok(Some(saved_path));
        }
        Ok(None) => {
            crate::repositories::artist_repository::update_image_status(
                conn,
                artist.id,
                "not_found",
            )
            .map_err(|e| e.to_string())?;
            return Ok(None);
        }
        Err(err) => {
            // Error occurred
            return Err(err);
        }
    }
}

pub fn ensure_song_lyrics(
    app_handle: &AppHandle,
    conn: &rusqlite::Connection,
    song: &SongResponse,
) -> Result<Option<String>, String> {
    match get_song_lyrics_from_lrclib(&song) {
        Ok(Some(lyrics)) => {
            let file_name = format!("song_{}_lyrics.lrc", song.id);

            let app_data_dir = app_handle
                .path()
                .app_data_dir()
                .map_err(|e| format!("Failed to get AppData directory: {}", e))?;

            if !app_data_dir.exists() {
                fs::create_dir_all(&app_data_dir)
                    .map_err(|e| format!("Failed to create AppData directory: {}", e))?;
            }

            let dest = app_data_dir.join(&file_name);

            match fs::write(&dest, &lyrics) {
                Ok(_) => {}
                Err(e) => {
                    return Err(e.to_string());
                }
            }

            let saved_path = dest.to_string_lossy().to_string();

            crate::repositories::lyrics_repository::update_lyrics_path(
                conn,
                song.id,
                &saved_path,
                "found",
            )
            .map_err(|e| e.to_string())?;

            return Ok(Some(saved_path));
        }
        Ok(None) => {
            crate::repositories::lyrics_repository::update_lyrics_status(
                conn,
                song.id,
                "not_found",
            )
            .map_err(|e| e.to_string())?;
            return Ok(None);
        }
        Err(err) => {
            return Err(err);
        }
    }
}

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


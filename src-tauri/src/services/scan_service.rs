use std::path::{Path, PathBuf};
use walkdir::WalkDir;

pub fn scan_for_mp3s<P: AsRef<Path>>(path: P) -> Vec<PathBuf> {
    let mut mp3_files = Vec::new();

    for entry in WalkDir::new(path).into_iter().filter_map(|e| e.ok()) {
        let entry_path = entry.path();

        if is_audio_file(entry_path) {
            mp3_files.push(entry_path.to_path_buf());
        }
    }

    mp3_files
}

fn is_audio_file(path: &Path) -> bool {
    if !path.is_file() {
        return false;
    }
    match path.extension().and_then(|s| s.to_str()) {
        Some(ext) => matches!(
            ext.to_lowercase().as_str(),
            "mp3" | "m4a" | "flac" | "wav" | "ogg"
        ),
        None => false,
    }
}

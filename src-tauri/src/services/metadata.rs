use std::path::Path;

use lofty::{
    file::{AudioFile, TaggedFileExt},
    tag::Accessor,
};

use crate::models::song::Song;

pub fn extract_metadata(path: &Path) -> Result<Song, String> {
    // Read the file and parse its format
    let tagged_file = lofty::read_from_path(path).map_err(|e| e.to_string())?;

    // Read audio properties (duration, bitrate, etc)
    let duration = tagged_file.properties().duration().as_secs() as i64;

    // Fallback strategy: Try the primary tag format first.
    // If that's missing or unpopulated, grab the first available tag block found.
    let tag = tagged_file
        .primary_tag()
        .or_else(|| tagged_file.first_tag());

    // Extract title, falling back to the filename if completely missing
    let title = tag
        .and_then(|t| t.title())
        .map(|s| s.to_string())
        .unwrap_or_else(|| {
            path.file_stem()
                .and_then(|s| s.to_str())
                .unwrap_or("Unknown Track")
                .to_string()
        });

    // Extract artist or use default
    let artist = tag
        .and_then(|t| t.artist())
        .map(|s| s.to_string())
        .unwrap_or_else(|| "Unknown Artist".to_string());

    // Extract album or use default
    let album = tag
        .and_then(|t| t.album())
        .map(|s| s.to_string())
        .unwrap_or_else(|| "Unknown Album".to_string());

    // Build and return a single Song instance
    Ok(Song {
        id: 0,
        title,
        artist,
        album,
        duration,
        path: path.to_string_lossy().into_owned(),
        created_at: 0,
    })
}

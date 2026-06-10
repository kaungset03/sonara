use std::path::Path;

use lofty::{
    file::{AudioFile, TaggedFileExt},
    tag::Accessor,
};

use crate::models::song::Song;

pub fn extract_metadata(path: &Path) -> Result<Song, String> {
    let tagged_file = lofty::read_from_path(path).map_err(|e| e.to_string())?;

    // Read properties (duration, bitrate, etc)
    let duration = tagged_file.properties().duration().as_secs() as i64;

    if let Some(tag) = tagged_file.primary_tag() {
        let title = tag.title().map(|s| s.to_string()).unwrap_or_else(|| {
            path.file_stem()
                .and_then(|s| s.to_str())
                .unwrap_or("Unknown Track")
                .to_string()
        });
        let artist = tag
            .artist()
            .map(|s| s.to_string())
            .unwrap_or_else(|| "Unknown Artist".into());
        let album = tag
            .album()
            .map(|s| s.to_string())
            .unwrap_or_else(|| "Unknown Album".into());

        Ok(Song {
            title,
            artist,
            album,
            duration,
            path: path.to_string_lossy().into_owned(),
            id: 0,
            created_at: 0,
        })
    } else {
        // File has no tags at all, but audio features are readable
        let file_name = path
            .file_stem()
            .and_then(|s| s.to_str())
            .unwrap_or("Unknown Track")
            .to_string();
        Ok(Song {
            id: 0, // This will be set by the database
            title: file_name,
            artist: "Unknown Artist".into(),
            album: "Unknown Album".into(),
            duration,
            path: path.to_string_lossy().into_owned(),
            created_at: 0, // This will be set by the database
        })
    }
}

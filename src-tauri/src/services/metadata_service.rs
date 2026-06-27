use std::path::Path;

use lofty::{
    file::{AudioFile, TaggedFileExt},
    tag::Accessor,
};

pub struct SongMetadata {
    pub title: String,
    pub artist: String,
    pub album: String,
    pub duration: i64,
    pub track_number: Option<i32>,
    pub file_modified_at: i64,
    pub file_size: i64,
    // pub embedded_artwork: Option<Vec<u8>>,
}

pub fn extract_metadata(path: &Path) -> Result<SongMetadata, String> {
    use std::fs;
    use std::time::UNIX_EPOCH;

    let metadata = fs::metadata(path).map_err(|e| e.to_string())?;

    let file_size = metadata.len() as i64;

    let modified = metadata
        .modified()
        .map_err(|e| e.to_string())?
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_secs() as i64;

    let tagged_file = lofty::read_from_path(path).map_err(|e| e.to_string())?;

    let duration = tagged_file.properties().duration().as_secs() as i64;

    let tag = tagged_file
        .primary_tag()
        .or_else(|| tagged_file.first_tag());

    let title = tag
        .and_then(|t| t.title())
        .map(|s| s.to_string())
        .unwrap_or_else(|| {
            path.file_stem()
                .and_then(|s| s.to_str())
                .unwrap_or("Unknown Track")
                .to_string()
        });

    let artist = tag
        .and_then(|t| t.artist())
        .map(|s| s.to_string())
        .unwrap_or_else(|| "Unknown Artist".to_string());

    let album = tag
        .and_then(|t| t.album())
        .map(|s| s.to_string())
        .unwrap_or_else(|| "Unknown Album".to_string());

    let track_number = tag.and_then(|t| t.track()).map(|n| n as i32);

    // let embedded_artwork = tag
    //     .and_then(|t| t.pictures().first())
    //     .map(|pic| pic.data().to_vec());

    Ok(SongMetadata {
        title,
        artist,
        album,
        duration,
        track_number,
        file_modified_at: modified,
        file_size,
        // embedded_artwork,
    })
}

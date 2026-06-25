use std::{fs, path::Path};

use lofty::{
    file::{AudioFile, TaggedFileExt},
    picture::MimeType,
    tag::Accessor,
};

use crate::models::song::Song;

fn sanitize_filename(name: &str) -> String {
    name.chars()
        .map(|c| if c.is_alphanumeric() { c } else { '_' })
        .collect()
}

pub fn extract_metadata(path: &Path) -> Result<Song, String> {
    // Read the file and parse its format
    let tagged_file = lofty::read_from_path(path).map_err(|e| e.to_string())?;

    let duration = tagged_file.properties().duration().as_secs() as i64;

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

    // Extract artist
    let artist = tag
        .and_then(|t| t.artist())
        .map(|s| s.to_string())
        .unwrap_or_else(|| "Unknown Artist".to_string());

    // Extract album
    let album = tag
        .and_then(|t| t.album())
        .map(|s| s.to_string())
        .unwrap_or_else(|| "Unknown Album".to_string());

    // Extract album artwork path if available and save it to
    let mut album_artwork_path: Option<String> = None;

    if let Some(tag) = tag {
        if let Some(picture) = tag.pictures().first() {
            let extension = match picture.mime_type() {
                Some(MimeType::Png) => "png",
                Some(MimeType::Jpeg) => "jpg",
                Some(MimeType::Bmp) => "bmp",
                Some(MimeType::Gif) => "gif",
                _ => "jpg",
            };

            let file_name = format!(
                "{}_{}.{}",
                sanitize_filename(&album),
                sanitize_filename(&artist),
                extension
            );

            let full_path = Path::new("album_artwork").join(file_name);

            // write image to disk
            fs::write(&full_path, &picture.data()).map_err(|e| e.to_string())?;

            album_artwork_path = Some(full_path.to_string_lossy().into_owned());
        }
    }

    // Build and return a single Song instance
    Ok(Song {
        id: 0,
        title,
        artist,
        album,
        album_artwork_path,
        duration,
        path: path.to_string_lossy().into_owned(),
        lyrics_path: None,
        created_at: 0,
        is_favorite: false,
        favorite_added_at: None,
        last_played_at: None,
        play_count: 0,
    })
}

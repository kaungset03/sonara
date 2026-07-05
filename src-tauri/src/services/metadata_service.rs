use std::path::Path;

use lofty::{
    file::{AudioFile, TaggedFileExt},
    tag::Accessor,
};

pub struct SongMetadata {
    pub title: String,
    pub artist: String,
    pub album: String,
    pub album_artist: String,
    pub duration: i64,
    pub track_number: Option<i32>,
    pub file_modified_at: i64,
    pub file_size: i64,
    pub path: std::path::PathBuf,
}

use symphonia::core::{
    formats::FormatOptions, io::MediaSourceStream, meta::MetadataOptions, probe::Hint,
};

use std::fs::File;

fn get_audio_duration_for_webm_file(path: &std::path::Path) -> Result<i64, String> {
    let file = File::open(path).map_err(|e| e.to_string())?;
    let mss = MediaSourceStream::new(Box::new(file), Default::default());

    let mut hint = Hint::new();
    if let Some(ext) = path.extension().and_then(|e| e.to_str()) {
        hint.with_extension(ext);
    }

    let probe = symphonia::default::get_probe()
        .format(
            &hint,
            mss,
            &FormatOptions::default(),
            &MetadataOptions::default(),
        )
        .map_err(|e| e.to_string())?;

    let format = probe.format;
    let track = format.default_track().ok_or("No default track found")?;
    let time_base = track.codec_params.time_base.ok_or("No time base")?;
    let n_frames = track.codec_params.n_frames.ok_or("No frame count")?;

    let duration = (n_frames as i128 * time_base.numer as i128 / time_base.denom as i128) as i64;

    Ok(duration)
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

    // if the file ext is webm, skip lofty extraction and return default metadata
    if let Some(ext) = path.extension().and_then(|s| s.to_str()) {
        if ext.to_lowercase() == "webm" {
            return Ok(SongMetadata {
                title: path
                    .file_stem()
                    .and_then(|s| s.to_str())
                    .unwrap_or("Unknown Track")
                    .to_string(),
                artist: "Unknown Artist".to_string(),
                album: "Unknown Album".to_string(),
                album_artist: "Unknown Artist".to_string(),
                duration: get_audio_duration_for_webm_file(path)?,
                path: path.to_path_buf(),
                track_number: None,
                file_modified_at: modified,
                file_size,
            });
        }
    }

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

    let album_artist = tag
        .and_then(|t| t.get_string(lofty::tag::ItemKey::AlbumArtist))
        .map(|s| s.to_string())
        .unwrap_or_else(|| artist.clone());

    let track_number = tag.and_then(|t| t.track()).map(|n| n as i32);

    Ok(SongMetadata {
        title,
        artist,
        album,
        album_artist,
        duration,
        track_number,
        file_modified_at: modified,
        file_size,
        path: path.to_path_buf(),
    })
}

use crate::repositories::lyrics_repository;

// get song lyrics
pub fn get_song_lyrics(
    conn: &rusqlite::Connection,
    song_id: i64,
) -> rusqlite::Result<Option<String>> {
    let lyrics = lyrics_repository::get_lyrics_by_song_id(conn, song_id);

    if let Ok(Some(lyrics)) = lyrics {
        if let Some(content) = lyrics.content {
            return Ok(Some(content));
        }
        if lyrics.status == "not_found" {
            return Ok(None);
        }
    }

    let song = crate::repositories::song_repository::get(conn, song_id)?;
    let lyrics = crate::services::file_service::ensure_song_lyrics(conn, &song)
        .map_err(|_| rusqlite::Error::InvalidQuery)?;

    Ok(lyrics)
}

pub fn update_song_lyrics(
    conn: &rusqlite::Connection,
    song_id: i64,
    lyrics_content: &str,
    source: &str,
) -> rusqlite::Result<()> {
    lyrics_repository::update_lyrics_content(conn, song_id, lyrics_content, "found", source)
}

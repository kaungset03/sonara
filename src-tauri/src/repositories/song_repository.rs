// insert song metadata into the database
pub fn insert_song_metadata(
    conn: &rusqlite::Connection,
    title: &str,
    artist: &str,
    album: &str,
    path: &str,
    duration: i64,
) -> rusqlite::Result<()> {
    let created_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    conn.execute(
        "INSERT INTO songs (title, artist, album, path, duration, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        rusqlite::params![title, artist, album, path, duration, created_at],
    )?;
    Ok(())
}

// get the song metadata from the database

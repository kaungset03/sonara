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
pub fn get_all_songs_query(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::song::Song>> {
    let mut stmt =
        conn.prepare("SELECT id, title, artist, album, duration, path, created_at FROM songs")?;
    let song_iter = stmt.query_map([], |row| {
        Ok(crate::models::song::Song {
            id: row.get(0)?,
            title: row.get(1)?,
            artist: row.get(2)?,
            album: row.get(3)?,
            duration: row.get(4)?,
            path: row.get(5)?,
            created_at: row.get(6)?,
        })
    })?;
    let songs: Result<Vec<crate::models::song::Song>, rusqlite::Error> = song_iter.collect();
    songs
}

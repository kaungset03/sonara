// create playlist
pub fn create_playlist_query(conn: &rusqlite::Connection, name: &str) -> rusqlite::Result<()> {
    let created_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;
    conn.execute(
        "INSERT INTO playlists (name, created_at) VALUES (?1, ?2)",
        rusqlite::params![name, created_at],
    )?;
    Ok(())
}

// get all playlists
pub fn get_all_playlists_query(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::playlist::Playlist>> {
    let mut stmt = conn.prepare("SELECT id, name, created_at FROM playlists")?;
    let playlist_iter = stmt.query_map([], |row| {
        Ok(crate::models::playlist::Playlist {
            id: row.get(0)?,
            name: row.get(1)?,
            created_at: row.get(2)?,
        })
    })?;
    let playlists: Result<Vec<crate::models::playlist::Playlist>, rusqlite::Error> =
        playlist_iter.collect();
    playlists
}

// edit playlist
pub fn edit_playlist_query(
    conn: &rusqlite::Connection,
    playlist_id: i64,
    new_name: &str,
) -> rusqlite::Result<()> {
    conn.execute(
        "UPDATE playlists SET name = ?1 WHERE id = ?2",
        rusqlite::params![new_name, playlist_id],
    )?;
    Ok(())
}

// delete playlist
pub fn delete_playlist_query(
    conn: &rusqlite::Connection,
    playlist_id: i64,
) -> rusqlite::Result<()> {
    conn.execute(
        "DELETE FROM playlists WHERE id = ?1",
        rusqlite::params![playlist_id],
    )?;
    Ok(())
}

// get songs by playlist
pub fn get_songs_by_playlist_query(
    conn: &rusqlite::Connection,
    playlist_id: i64,
) -> rusqlite::Result<Vec<crate::models::song::Song>> {
    let mut stmt = conn.prepare(
        "SELECT s.id, s.title, s.artist, s.album, s.duration, s.path, s.is_favorite, s.favorite_added_at, s.created_at
         FROM songs s
         INNER JOIN playlist_songs ps ON s.id = ps.song_id
         WHERE ps.playlist_id = ?1",
    )?;
    let song_iter = stmt.query_map([playlist_id], |row| {
        Ok(crate::models::song::Song {
            id: row.get(0)?,
            title: row.get(1)?,
            artist: row.get(2)?,
            album: row.get(3)?,
            duration: row.get(4)?,
            path: row.get(5)?,
            is_favorite: row.get(6)?,
            favorite_added_at: row.get(7)?,
            created_at: row.get(8)?,
        })
    })?;
    let songs: Result<Vec<crate::models::song::Song>, rusqlite::Error> = song_iter.collect();
    songs
}

// add new song to playlist
pub fn add_song_to_playlist_query(
    conn: &rusqlite::Connection,
    playlist_id: i64,
    song_id: i64,
) -> rusqlite::Result<()> {
    let created_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;
    conn.execute(
        "INSERT INTO playlist_songs (playlist_id, song_id, created_at) VALUES (?1, ?2, ?3)",
        rusqlite::params![playlist_id, song_id, created_at],
    )?;
    Ok(())
}

// remove song from playlist
pub fn remove_song_from_playlist_query(
    conn: &rusqlite::Connection,
    playlist_id: i64,
    song_id: i64,
) -> rusqlite::Result<()> {
    conn.execute(
        "DELETE FROM playlist_songs WHERE playlist_id = ?1 AND song_id = ?2",
        rusqlite::params![playlist_id, song_id],
    )?;
    Ok(())
}

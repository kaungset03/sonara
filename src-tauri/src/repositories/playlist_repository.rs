// get all playlists
pub fn index(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::playlist::Playlist>> {
    let mut stmt = conn.prepare("SELECT * FROM playlists")?;
    let playlist_iter = stmt.query_map([], |row| {
        Ok(crate::models::playlist::Playlist {
            id: row.get("id")?,
            name: row.get("name")?,
            created_at: row.get("created_at")?,
        })
    })?;
    playlist_iter.collect()
}

// get playlist by id
pub fn get(
    conn: &rusqlite::Connection,
    playlist_id: i64,
) -> rusqlite::Result<crate::models::playlist::Playlist> {
    let mut stmt = conn.prepare("SELECT * FROM playlists WHERE id = ?1")?;
    let playlist = stmt.query_row(rusqlite::params![playlist_id], |row| {
        Ok(crate::models::playlist::Playlist {
            id: row.get("id")?,
            name: row.get("name")?,
            created_at: row.get("created_at")?,
        })
    });
    playlist
}

// create playlist
pub fn create(conn: &rusqlite::Connection, name: &str) -> rusqlite::Result<i64> {
    let created_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;
    conn.execute(
        "INSERT INTO playlists (name, created_at) VALUES (?1, ?2)",
        rusqlite::params![name, created_at],
    )?;
    let playlist_id = conn.last_insert_rowid();
    Ok(playlist_id)
}

// update playlist name
pub fn update(conn: &rusqlite::Connection, id: i64, name: &str) -> rusqlite::Result<()> {
    conn.execute(
        "UPDATE playlists SET name = ?1 WHERE id = ?2",
        rusqlite::params![name, id],
    )?;
    Ok(())
}

// delete playlist
pub fn delete(conn: &rusqlite::Connection, id: i64) -> rusqlite::Result<()> {
    conn.execute("DELETE FROM playlists WHERE id = ?1", rusqlite::params![id])?;
    Ok(())
}

// add songs to playlist
pub fn add_songs_to_playlist_query(
    conn: &mut rusqlite::Connection,
    playlist_id: i64,
    song_ids: &[i64],
) -> rusqlite::Result<()> {
    let created_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;
    let tx = conn.transaction()?;
    for &song_id in song_ids {
        tx.execute(
            "INSERT INTO playlist_songs (playlist_id, song_id, created_at) VALUES (?1, ?2, ?3)",
            rusqlite::params![playlist_id, song_id, created_at],
        )?;
    }
    tx.commit()?;
    Ok(())
}

// remove songs from playlist
pub fn remove_songs_from_playlist_query(
    conn: &mut rusqlite::Connection,
    playlist_id: i64,
    song_ids: &[i64],
) -> rusqlite::Result<()> {
    let tx = conn.transaction()?;
    for &song_id in song_ids {
        tx.execute(
            "DELETE FROM playlist_songs WHERE playlist_id = ?1 AND song_id = ?2",
            rusqlite::params![playlist_id, song_id],
        )?;
    }
    tx.commit()?;
    Ok(())
}

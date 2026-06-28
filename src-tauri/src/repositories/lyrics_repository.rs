use rusqlite::Connection;

use crate::models::lyrics::Lyrics;

// get lyrics path by song id
pub fn get_lyrics_by_song_id(conn: &Connection, song_id: i64) -> rusqlite::Result<Option<Lyrics>> {
    let mut stmt = conn.prepare("SELECT * FROM lyrics WHERE song_id = ?1")?;
    let mut rows = stmt.query(rusqlite::params![song_id])?;

    if let Some(row) = rows.next()? {
        let lyrics = Lyrics {
            id: row.get("id")?,
            song_id: row.get("song_id")?,
            path: row.get("path")?,
            status: row.get("status")?,
        };
        Ok(Some(lyrics))
    } else {
        Ok(None)
    }
}

// create or update lyrics path for a song
pub fn update_lyrics_path(
    conn: &Connection,
    song_id: i64,
    path: &str,
    status: &str,
) -> rusqlite::Result<()> {
    conn.execute(
        "INSERT INTO lyrics (song_id, path, status) VALUES (?1, ?2, ?3)
         ON CONFLICT(song_id) DO UPDATE SET path=excluded.path, status=excluded.status",
        rusqlite::params![song_id, path, status],
    )?;
    Ok(())
}

// create or update lyrics status for a song
pub fn update_lyrics_status(conn: &Connection, song_id: i64, status: &str) -> rusqlite::Result<()> {
    conn.execute(
        "INSERT INTO lyrics (song_id, status) VALUES (?1, ?2)
         ON CONFLICT(song_id) DO UPDATE SET status=excluded.status",
        rusqlite::params![song_id, status],
    )?;
    Ok(())
}

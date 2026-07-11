use rusqlite::Connection;

use crate::models::lyrics::Lyrics;

// get lyrics path by song id
pub fn get_lyrics_by_song_id(conn: &Connection, song_id: i64) -> rusqlite::Result<Option<Lyrics>> {
    let mut stmt = conn.prepare("SELECT * FROM song_lyrics WHERE song_id = ?1 LIMIT 1")?;
    let mut rows = stmt.query(rusqlite::params![song_id])?;
    if let Some(row) = rows.next()? {
        let lyrics = Lyrics {
            id: row.get("id")?,
            song_id: row.get("song_id")?,
            content: row.get("content")?,
            source: row.get("source")?,
            status: row.get("status")?,
        };
        Ok(Some(lyrics))
    } else {
        Ok(None)
    }
}

// create or update lyrics content for a song
pub fn update_lyrics_content(
    conn: &Connection,
    song_id: i64,
    content: &str,
    status: &str,
    source: &str,
) -> rusqlite::Result<()> {
    conn.execute(
        "INSERT INTO song_lyrics (song_id, content, status, source) VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT(song_id) DO UPDATE SET content=excluded.content, status=excluded.status, source=excluded.source",
        rusqlite::params![song_id, content, status, source],
    )?;
    Ok(())
}

// create or update lyrics status for a song
pub fn update_lyrics_status(conn: &Connection, song_id: i64, status: &str) -> rusqlite::Result<()> {
    conn.execute(
        "INSERT INTO song_lyrics (song_id, status) VALUES (?1, ?2)
         ON CONFLICT(song_id) DO UPDATE SET status=excluded.status",
        rusqlite::params![song_id, status],
    )?;
    Ok(())
}

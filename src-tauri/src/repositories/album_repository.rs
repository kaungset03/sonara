use rusqlite::{params, Connection};

use crate::models::album::Album;

// get all albums
pub fn index(conn: &Connection) -> rusqlite::Result<Vec<Album>> {
    let mut stmt = conn.prepare("SELECT * FROM albums")?;
    let album_iter = stmt.query_map([], |row| {
        Ok(crate::models::album::Album {
            id: row.get("id")?,
            name: row.get("name")?,
            artist_id: row.get("artist_id")?,
            cover_path: row.get("cover_path")?,
            created_at: row.get("created_at")?,
        })
    })?;

    let albums = album_iter.collect();
    albums
}

// find or create an album by name and artist_id
pub fn find_or_create(conn: &Connection, name: &str, artist_id: i64) -> rusqlite::Result<i64> {
    let created_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    conn.execute(
        "INSERT OR IGNORE INTO albums (name, artist_id, created_at) VALUES (?1, ?2, ?3)",
        params![name, artist_id, created_at],
    )?;

    conn.query_row(
        "SELECT id FROM albums WHERE name = ?1 AND artist_id = ?2",
        params![name, artist_id],
        |row| row.get(0),
    )
}

// get an album by id
pub fn get(conn: &Connection, id: i64) -> rusqlite::Result<Album> {
    let mut stmt = conn.prepare("SELECT * FROM albums WHERE id = ?1")?;
    let album = stmt.query_row(params![id], |row| {
        Ok(crate::models::album::Album {
            id: row.get("id")?,
            name: row.get("name")?,
            artist_id: row.get("artist_id")?,
            cover_path: row.get("cover_path")?,
            created_at: row.get("created_at")?,
        })
    })?;
    Ok(album)
}

// Update album cover path by id
pub fn update_cover_path(conn: &Connection, id: i64, cover_path: &str) -> rusqlite::Result<()> {
    conn.execute(
        "UPDATE albums SET cover_path = ?1 WHERE id = ?2",
        params![cover_path, id],
    )?;
    Ok(())
}

// Delete an album by id
// pub fn delete(conn: &Connection, id: i64) -> rusqlite::Result<()> {
//     conn.execute("DELETE FROM albums WHERE id = ?1", params![id])?;
//     Ok(())
// }

// Search albums by name
pub fn search(conn: &Connection, name: &str) -> rusqlite::Result<Vec<Album>> {
    let mut stmt = conn.prepare("SELECT * FROM albums WHERE name LIKE ?1")?;
    let album_iter = stmt.query_map(params![format!("%{}%", name)], |row| {
        Ok(crate::models::album::Album {
            id: row.get("id")?,
            name: row.get("name")?,
            artist_id: row.get("artist_id")?,
            cover_path: row.get("cover_path")?,
            created_at: row.get("created_at")?,
        })
    })?;

    let albums = album_iter.collect();
    albums
}

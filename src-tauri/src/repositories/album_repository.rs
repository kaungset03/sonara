use rusqlite::{params, Connection};

use crate::models::album::Album;

// get all albums
pub fn index(conn: &Connection) -> rusqlite::Result<Vec<Album>> {
    let mut stmt = conn.prepare(
        "
        SELECT alb.*, art.name AS artist_name FROM albums alb
        JOIN artists art ON alb.artist_id = art.id
        ORDER BY alb.created_at DESC;
        ",
    )?;
    let album_iter = stmt.query_map([], |row| {
        Ok(crate::models::album::Album {
            id: row.get("id")?,
            name: row.get("name")?,
            artist_id: row.get("artist_id")?,
            cover_path: row.get("cover_path")?,
            cover_status: row.get("cover_status")?,
            created_at: row.get("created_at")?,
            artist_name: row.get("artist_name")?,
        })
    })?;

    let albums = album_iter.collect();
    albums
}

// find or create an album by name and artist_id
pub fn find_or_create(
    conn: &Connection,
    name: &str,
    artist_id: i64,
) -> rusqlite::Result<(i64, bool)> {
    let name = name.trim();
    let created_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    let inserted = conn.execute(
        "INSERT INTO albums (name, artist_id, created_at) VALUES (?1, ?2, ?3) ON CONFLICT(name, artist_id) DO NOTHING",
        params![name, artist_id, created_at],
    )?;

    let newly_created = inserted > 0;

    let album_id = conn.query_row(
        "SELECT id FROM albums WHERE name = ?1 AND artist_id = ?2",
        params![name, artist_id],
        |row| row.get("id"),
    )?;

    Ok((album_id, newly_created))
}

// get an album by id
pub fn get(conn: &Connection, id: i64) -> rusqlite::Result<Album> {
    let mut stmt = conn.prepare(
        "
        SELECT alb.*, art.name as artist_name FROM albums alb 
        JOIN artists art ON alb.artist_id = art.id
        WHERE alb.id = ?1
    ",
    )?;
    let album = stmt.query_row(params![id], |row| {
        Ok(crate::models::album::Album {
            id: row.get("id")?,
            name: row.get("name")?,
            artist_id: row.get("artist_id")?,
            cover_path: row.get("cover_path")?,
            cover_status: row.get("cover_status")?,
            created_at: row.get("created_at")?,
            artist_name: row.get("artist_name")?,
        })
    })?;
    Ok(album)
}

// Update album cover path by id
pub fn update_cover_path(
    conn: &Connection,
    id: i64,
    cover_path: &str,
    cover_status: &str,
) -> rusqlite::Result<()> {
    conn.execute(
        "UPDATE albums SET cover_path = ?1, cover_status = ?2 WHERE id = ?3",
        params![cover_path, cover_status, id],
    )?;
    Ok(())
}

// Update album cover status by id
pub fn update_cover_status(conn: &Connection, id: i64, cover_status: &str) -> rusqlite::Result<()> {
    conn.execute(
        "UPDATE albums SET cover_status = ?1 WHERE id = ?2",
        params![cover_status, id],
    )?;
    Ok(())
}

// Delete albums without songs attached to them
pub fn delete_empty_albums(conn: &Connection) -> rusqlite::Result<usize> {
    let deleted = conn.execute(
        "DELETE FROM albums WHERE id NOT IN (SELECT DISTINCT album_id FROM songs) AND name <> 'Unknown Album'",
        params![],
    )?;
    Ok(deleted)
}

// Search albums by name
pub fn search(conn: &Connection, name: &str) -> rusqlite::Result<Vec<Album>> {
    let mut stmt = conn.prepare(
        "
        SELECT alb.*, art.name as artist_name FROM albums alb 
        JOIN artists art ON alb.artist_id = art.id
        WHERE alb.name LIKE ?1
    ",
    )?;
    let album_iter = stmt.query_map(params![format!("%{}%", name)], |row| {
        Ok(crate::models::album::Album {
            id: row.get("id")?,
            name: row.get("name")?,
            artist_id: row.get("artist_id")?,
            cover_path: row.get("cover_path")?,
            cover_status: row.get("cover_status")?,
            created_at: row.get("created_at")?,
            artist_name: row.get("artist_name")?,
        })
    })?;

    let albums = album_iter.collect();
    albums
}

// light weight search albums by name (only id, name)
pub fn search_by_name(
    conn: &Connection,
    name: &str,
) -> rusqlite::Result<Vec<crate::models::search::LiveSearchResult>> {
    let mut stmt = conn.prepare(
        "
        SELECT alb.id, alb.name FROM albums alb 
        WHERE alb.name LIKE ?1
    ",
    )?;
    let album_iter = stmt.query_map(params![format!("%{}%", name)], |row| {
        Ok(crate::models::search::LiveSearchResult {
            id: row.get("id")?,
            name: row.get("name")?,
        })
    })?;

    let albums = album_iter.collect();
    albums
}

use rusqlite::{params, Connection};

use crate::models::artist::Artist;

// Get all artists
pub fn index(conn: &Connection) -> rusqlite::Result<Vec<Artist>> {
    let mut stmt = conn.prepare(
        "
        SELECT DISTINCT a.*
        FROM artists a
        ORDER BY a.name ASC
        ",
    )?;
    let artist_iter = stmt.query_map([], |row| {
        Ok(Artist {
            id: row.get("id")?,
            name: row.get("name")?,
            image_path: row.get("image_path")?,
            image_status: row.get("image_status")?,
            created_at: row.get("created_at")?,
        })
    })?;

    let artists = artist_iter.collect();
    artists
}

pub fn find_or_create(conn: &Connection, name: &str) -> rusqlite::Result<(i64, bool)> {
    let name = name.trim();
    let created_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    let inserted = conn.execute(
        "INSERT INTO artists (name, created_at) VALUES (?1, ?2) ON CONFLICT(name) DO NOTHING",
        params![name, created_at],
    )?;

    let newly_created = inserted > 0;

    let artist_id = conn.query_row(
        "SELECT id FROM artists WHERE name = ?1",
        params![name],
        |row| row.get(0),
    )?;

    Ok((artist_id, newly_created))
}

// get an artist by id
pub fn get(conn: &Connection, id: i64) -> rusqlite::Result<Artist> {
    let mut stmt = conn.prepare("SELECT * FROM artists WHERE id = ?1")?;
    let artist = stmt.query_row(params![id], |row| {
        Ok(Artist {
            id: row.get("id")?,
            name: row.get("name")?,
            image_path: row.get("image_path")?,
            image_status: row.get("image_status")?,
            created_at: row.get("created_at")?,
        })
    })?;
    Ok(artist)
}

// Update image path of an artist by id
pub fn update_image_path(conn: &Connection, id: i64, image_path: &str) -> rusqlite::Result<()> {
    conn.execute(
        "UPDATE artists SET image_path = ?1 WHERE id = ?2",
        params![image_path, id],
    )?;
    Ok(())
}

// Update image status of an artist by id
pub fn update_image_status(conn: &Connection, id: i64, image_status: &str) -> rusqlite::Result<()> {
    conn.execute(
        "UPDATE artists SET image_status = ?1 WHERE id = ?2",
        params![image_status, id],
    )?;
    Ok(())
}

// Delete artists with no associated songs and no associated albums
pub fn delete_empty_artists(conn: &Connection) -> rusqlite::Result<usize> {
    let deleted = conn.execute(
        "
        DELETE FROM artists
        WHERE id NOT IN (SELECT DISTINCT artist_id FROM songs)
        AND id NOT IN (SELECT DISTINCT artist_id FROM albums)
        AND name <> 'Unknown Artist'
    ",
        [],
    )?;
    Ok(deleted)
}

// Search artists by name
pub fn search(conn: &Connection, query: &str) -> rusqlite::Result<Vec<Artist>> {
    let mut stmt = conn.prepare("SELECT * FROM artists WHERE name LIKE ?1")?;
    let artist_iter = stmt.query_map(params![format!("%{}%", query)], |row| {
        Ok(Artist {
            id: row.get("id")?,
            name: row.get("name")?,
            image_path: row.get("image_path")?,
            image_status: row.get("image_status")?,
            created_at: row.get("created_at")?,
        })
    })?;

    let artists = artist_iter.collect();
    artists
}

// lightweight search for artists by name, returning only id and name
pub fn search_by_name(
    conn: &Connection,
    query: &str,
) -> rusqlite::Result<Vec<crate::models::search::LiveSearchResult>> {
    let mut stmt = conn.prepare("SELECT id, name FROM artists WHERE name LIKE ?1")?;
    let artist_iter = stmt.query_map(params![format!("%{}%", query)], |row| {
        Ok(crate::models::search::LiveSearchResult {
            id: row.get("id")?,
            name: row.get("name")?,
        })
    })?;

    let artists = artist_iter.collect();
    artists
}

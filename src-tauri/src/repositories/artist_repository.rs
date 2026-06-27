use rusqlite::{params, Connection};

use crate::models::artist::Artist;

// Get all artists
pub fn index(conn: &Connection) -> rusqlite::Result<Vec<Artist>> {
    let mut stmt = conn.prepare(
        "
        SELECT DISTINCT a.*
        FROM artists a
        JOIN songs s ON s.artist_id = a.id;",
    )?;
    let artist_iter = stmt.query_map([], |row| {
        Ok(Artist {
            id: row.get("id")?,
            name: row.get("name")?,
            image_path: row.get("image_path")?,
            created_at: row.get("created_at")?,
        })
    })?;

    let artists = artist_iter.collect();
    artists
}

// create a new artist
// pub fn create(conn: &Connection, name: &str, image_path: Option<&str>) -> rusqlite::Result<i64> {
//     let created_at = std::time::SystemTime::now()
//         .duration_since(std::time::UNIX_EPOCH)
//         .unwrap()
//         .as_secs() as i64;

//     conn.execute(
//         "INSERT INTO artists (name, image_path, created_at) VALUES (?1, ?2, ?3)",
//         params![name, image_path, created_at],
//     )?;
//     Ok(conn.last_insert_rowid())
// }

pub fn find_or_create(conn: &Connection, name: &str) -> rusqlite::Result<i64> {
    let created_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    conn.execute(
        "INSERT OR IGNORE INTO artists (name, created_at) VALUES (?1, ?2)",
        params![name, created_at],
    )?;

    conn.query_row(
        "SELECT id FROM artists WHERE name = ?1",
        params![name],
        |row| row.get(0),
    )
}

// get an artist by id
pub fn get(conn: &Connection, id: i64) -> rusqlite::Result<Artist> {
    let mut stmt = conn.prepare("SELECT * FROM artists WHERE id = ?1")?;
    let artist = stmt.query_row(params![id], |row| {
        Ok(Artist {
            id: row.get("id")?,
            name: row.get("name")?,
            image_path: row.get("image_path")?,
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

// Delete an artist by id
// pub fn delete(conn: &Connection, id: i64) -> rusqlite::Result<()> {
//     conn.execute("DELETE FROM artists WHERE id = ?1", params![id])?;
//     Ok(())
// }

// Search artists by name
pub fn search(conn: &Connection, query: &str) -> rusqlite::Result<Vec<Artist>> {
    let mut stmt = conn.prepare("SELECT * FROM artists WHERE name LIKE ?1")?;
    let artist_iter = stmt.query_map(params![format!("%{}%", query)], |row| {
        Ok(Artist {
            id: row.get("id")?,
            name: row.get("name")?,
            image_path: row.get("image_path")?,
            created_at: row.get("created_at")?,
        })
    })?;

    let artists = artist_iter.collect();
    artists
}

use std::fs;

use rusqlite::{Connection, Result};

pub fn process_album_artwork(
    conn: &Connection,
    artwork: Option<Vec<u8>>,
    album_id: i64,
) -> Result<()> {
    // 1. No embedded artwork → nothing to do
    let artwork = match artwork {
        Some(data) => data,
        None => return Ok(()),
    };

    // 2. Check current album artwork in ONE query
    let current: Option<String> = conn.query_row(
        "SELECT artwork_path FROM albums WHERE id = ?1",
        [album_id],
        |row| row.get(0),
    )?;

    // 3. If already exists → skip
    if current.is_some() {
        return Ok(());
    }

    // 4. Save artwork file
    let path = format!("artwork/album_{}.jpg", album_id);
    fs::write(&path, artwork).unwrap();

    // 5. Update DB
    conn.execute(
        "UPDATE albums SET artwork_path = ?1 WHERE id = ?2",
        (&path, album_id),
    )?;

    Ok(())
}

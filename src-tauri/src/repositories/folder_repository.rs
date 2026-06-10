use rusqlite::{params, Connection};

pub fn insert_folder(conn: &Connection, path: &str) -> rusqlite::Result<()> {
    let created_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    // "INSERT OR IGNORE" will silently do nothing if the path already exists,
    // instead of throwing an error and breaking your code execution loop.
    conn.execute(
        "INSERT OR IGNORE INTO library_folders (path, created_at) VALUES (?1, ?2)",
        params![path, created_at],
    )?;
    Ok(())
}

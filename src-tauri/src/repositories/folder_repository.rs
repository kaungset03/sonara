use rusqlite::{params, Connection};

use crate::models::folder::Folder;

pub fn insert_folder(conn: &Connection, path: &str) -> rusqlite::Result<i64> {
    let created_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    conn.execute(
        "INSERT OR IGNORE INTO library_folders (path, created_at) VALUES (?1, ?2)",
        params![path, created_at],
    )?;
    let folder_id = conn.last_insert_rowid() as i64;
    Ok(folder_id)
}

pub fn get_all_folders_query(conn: &Connection) -> rusqlite::Result<Vec<Folder>> {
    let mut stmt = conn.prepare(
        "
        SELECT
            f.id,
            f.path,
            f.created_at,
            COUNT(s.id) as song_count
        FROM library_folders f
        LEFT JOIN songs s ON s.folder_id = f.id
        GROUP BY f.id
        ",
    )?;

    let folder_iter = stmt.query_map([], |row| {
        Ok(Folder {
            id: row.get(0)?,
            path: row.get(1)?,
            created_at: row.get(2)?,
            song_count: row.get(3)?,
        })
    })?;

    folder_iter.collect()
}

pub fn delete_folder_query(conn: &Connection, id: i64) -> rusqlite::Result<()> {
    conn.execute("DELETE FROM library_folders WHERE id = ?1", params![id])?;
    Ok(())
}

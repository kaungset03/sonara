use rusqlite::{params, Connection};
use tauri::AppHandle;

use crate::models::{folder::Folder, stats::AppStats};

pub fn insert(conn: &Connection, path: &str) -> rusqlite::Result<i64> {
    let created_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    conn.execute(
        "INSERT OR IGNORE INTO library_folders (path, created_at)
         VALUES (?1, ?2)",
        params![path, created_at],
    )?;

    let folder_id: i64 = conn.query_row(
        "SELECT id FROM library_folders WHERE path = ?1",
        [path],
        |row| row.get(0),
    )?;

    Ok(folder_id)
}

pub fn index(conn: &Connection) -> rusqlite::Result<Vec<Folder>> {
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

pub fn delete(conn: &Connection, id: i64) -> rusqlite::Result<()> {
    conn.execute("DELETE FROM library_folders WHERE id = ?1", params![id])?;
    Ok(())
}

pub fn app_stats(app_handle: &AppHandle, conn: &Connection) -> rusqlite::Result<AppStats> {
    let app_version = app_handle.package_info().version.to_string();
    let stats = conn.query_row(
        "SELECT 
        (SELECT COUNT(*) FROM songs) AS total_songs, 
        (SELECT COUNT(*) FROM albums) AS total_albums, 
        (SELECT COUNT(*) FROM artists) AS total_artists,
        (SELECT COUNT(*) FROM library_folders) AS total_folders",
        [],
        |row| {
            Ok(AppStats {
                total_songs: row.get(0)?,
                total_albums: row.get(1)?,
                total_artists: row.get(2)?,
                total_folders: row.get(3)?,
                app_version,
            })
        },
    )?;
    Ok(stats)
}

pub fn home_data(conn: &Connection) -> rusqlite::Result<crate::models::stats::HomeData> {
    let stats = conn.query_row(
        "SELECT 
        (SELECT COUNT(*) FROM songs) AS total_songs, 
        (SELECT COUNT(*) FROM albums) AS total_albums, 
        (SELECT COUNT(*) FROM artists) AS total_artists,
        (SELECT COUNT(*) FROM songs WHERE is_favorite = 1) AS total_favorites",
        [],
        |row| {
            Ok(crate::models::stats::Stats {
                total_songs: row.get(0)?,
                total_albums: row.get(1)?,
                total_artists: row.get(2)?,
                total_favorites: row.get(3)?,
            })
        },
    )?;

    let home_data = crate::models::stats::HomeData {
        stats,
        recently_added_songs: crate::repositories::song_repository::get_recently_added(conn, 8)?,
        most_played_songs: crate::repositories::song_repository::get_most_played(conn, 8)?,
        recently_played_songs: crate::repositories::song_repository::get_recently_played(conn, 4)?,
    };

    Ok(home_data)
}

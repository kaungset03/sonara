use crate::repositories::folder_repository;

pub fn add_folder(conn: &rusqlite::Connection, path: &str) -> rusqlite::Result<()> {
    // insert the folder into the database
    // if successful, scan the folder for music files
    folder_repository::insert_folder(conn, path)?;
    Ok(())
}

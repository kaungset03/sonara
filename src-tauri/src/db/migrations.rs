use rusqlite::{Connection, Result};

pub fn run_migrations(conn: &Connection) -> Result<()> {
    conn.execute_batch(include_str!("migrations/001_initial.sql"))?;
    conn.execute_batch(include_str!("migrations/002_add_indexes.sql"))?;
    conn.execute_batch(include_str!("migrations/003_add_metadata_jobs.sql"))?;
    Ok(())
}

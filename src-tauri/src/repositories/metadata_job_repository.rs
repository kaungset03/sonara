use rusqlite::{params, Connection};

// insert job into table
pub fn create(
    conn: &Connection,
    entity_type: &str,
    entity_id: i64,
    job_type: &str,
) -> rusqlite::Result<()> {
    let time = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    conn.execute(
        "INSERT INTO metadata_jobs (entity_type, entity_id, job_type, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?4)",
        params![entity_type, entity_id, job_type, time, time],
    )?;
    Ok(())
}

// get next pending job
// update job status

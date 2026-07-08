use rusqlite::{params, Connection};

use crate::models::metadata_job::MetadataJob;

fn job_from_row(row: &rusqlite::Row) -> rusqlite::Result<MetadataJob> {
    Ok(MetadataJob {
        id: row.get("id")?,
        entity_type: row.get("entity_type")?,
        entity_id: row.get("entity_id")?,
        job_type: row.get("job_type")?,
        status: row.get("status")?,
        attempt_count: row.get("attempt_count")?,
        last_error: row.get("last_error")?,
        created_at: row.get("created_at")?,
        updated_at: row.get("updated_at")?,
    })
}

// get all jobs
// pub fn index(conn: &Connection) -> rusqlite::Result<Vec<MetadataJob>> {
//     let mut stmt = conn.prepare("SELECT * FROM metadata_jobs")?;

//     let job_iter = stmt.query_map([], |row| job_from_row(row))?;

//     let jobs = job_iter.collect();
//     jobs
// }

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
        "
        INSERT INTO metadata_jobs 
            (entity_type, entity_id, job_type, created_at, updated_at) 
            VALUES (?1, ?2, ?3, ?4, ?4) 
        ON CONFLICT(entity_type, entity_id, job_type) DO NOTHING",
        params![entity_type, entity_id, job_type, time],
    )?;
    Ok(())
}

// get next pending job
pub fn get_pending_jobs(conn: &Connection, limit: usize) -> rusqlite::Result<Vec<MetadataJob>> {
    let mut stmt = conn.prepare(
        "SELECT * FROM metadata_jobs WHERE status = 'pending' ORDER BY created_at ASC LIMIT ?1",
    )?;

    let job_iter = stmt.query_map([limit], |row| job_from_row(row))?;

    let jobs: Vec<MetadataJob> = job_iter.collect::<rusqlite::Result<Vec<MetadataJob>>>()?;
    Ok(jobs)
}

// update job status
pub fn update_job_status(
    conn: &Connection,
    job_id: i64,
    status: &str,
    last_error: Option<&str>,
) -> rusqlite::Result<()> {
    let time = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    conn.execute(
        "
        UPDATE metadata_jobs 
        SET status = ?1, last_error = ?2, updated_at = ?3 
        WHERE id = ?4",
        params![status, last_error, time, job_id],
    )?;
    Ok(())
}

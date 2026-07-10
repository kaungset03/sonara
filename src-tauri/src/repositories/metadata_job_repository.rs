use rusqlite::{params, Connection};

use crate::models::metadata_job::MetadataJob;

fn job_from_row(row: &rusqlite::Row) -> rusqlite::Result<MetadataJob> {
    Ok(MetadataJob {
        id: row.get("id")?,
        entity_type: row.get("entity_type")?,
        entity_id: row.get("entity_id")?,
        job_type: row.get("job_type")?,
        status: row.get("status")?,
        priority_lvl: row.get("priority_lvl")?,
        attempt_count: row.get("attempt_count")?,
        last_error: row.get("last_error")?,
        created_at: row.get("created_at")?,
        updated_at: row.get("updated_at")?,
    })
}

// insert job into table
pub fn create(
    conn: &Connection,
    entity_type: &str,
    entity_id: i64,
    job_type: &str,
    priority_lvl: i32,
) -> rusqlite::Result<()> {
    let time = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    conn.execute(
        "
        INSERT INTO metadata_jobs 
            (entity_type, entity_id, job_type, priority_lvl, created_at, updated_at) 
            VALUES (?1, ?2, ?3, ?4, ?5, ?5) 
        ON CONFLICT(entity_type, entity_id, job_type) DO NOTHING",
        params![entity_type, entity_id, job_type, priority_lvl, time],
    )?;
    Ok(())
}

// get next pending job
pub fn get_pending_jobs(conn: &Connection, limit: usize) -> rusqlite::Result<Vec<MetadataJob>> {
    let mut stmt = conn.prepare(
        "SELECT * FROM metadata_jobs WHERE status = 'pending' AND attempt_count < 3 ORDER BY priority_lvl DESC, created_at ASC LIMIT ?1",
    )?;

    let job_iter = stmt.query_map([limit], |row| job_from_row(row))?;

    let jobs: Vec<MetadataJob> = job_iter.collect::<rusqlite::Result<Vec<MetadataJob>>>()?;
    Ok(jobs)
}

// update job status
pub fn update_job_status(conn: &Connection, job_id: i64, status: &str) -> rusqlite::Result<()> {
    let time = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    conn.execute(
        "
        UPDATE metadata_jobs 
        SET status = ?1, updated_at = ?2 
        WHERE id = ?3",
        params![status, time, job_id],
    )?;
    Ok(())
}

// Complete job
pub fn complete_job(conn: &Connection, job_id: i64) -> rusqlite::Result<()> {
    let time = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    conn.execute(
        "
        UPDATE metadata_jobs 
        SET status = 'completed', updated_at = ?1 
        WHERE id = ?2",
        params![time, job_id],
    )?;
    Ok(())
}

// Fail job by incrementing attempt_count, reducing priority, setting last_error, status to 'failed' if attempt_count >= 3, and updating updated_at
pub fn fail_job(conn: &Connection, job_id: i64, last_error: &str) -> rusqlite::Result<()> {
    let time = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    conn.execute(
        "
        UPDATE metadata_jobs 
        SET 
            attempt_count = attempt_count + 1, 
            priority_lvl = priority_lvl - 1,
            last_error = ?1, 
            status = CASE WHEN attempt_count + 1 >= 3 THEN 'failed' ELSE 'pending' END, 
            updated_at = ?2 
        WHERE id = ?3",
        params![last_error, time, job_id],
    )?;
    Ok(())
}

pub fn increase_job_priority(
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
        UPDATE metadata_jobs 
        SET priority_lvl = 6, updated_at = ?1 
        WHERE entity_type = ?2 AND entity_id = ?3 AND job_type = ?4",
        params![time, entity_type, entity_id, job_type],
    )?;
    Ok(())
}

pub fn delete_by_entity(
    conn: &Connection,
    entity_type: &str,
    entity_id: i64,
) -> rusqlite::Result<()> {
    conn.execute(
        "DELETE FROM metadata_jobs WHERE entity_type = ?1 AND entity_id = ?2",
        params![entity_type, entity_id],
    )?;
    Ok(())
}

// delete orphaned jobs (jobs with no corresponding entity in the database)
pub fn delete_orphaned_jobs(conn: &Connection) -> rusqlite::Result<()> {
    conn.execute(
        "DELETE FROM metadata_jobs 
            WHERE entity_type = 'album' AND entity_id NOT IN (SELECT id FROM albums) 
            OR entity_type = 'artist' AND entity_id NOT IN (SELECT id FROM artists)",
        [],
    )?;
    Ok(())
}

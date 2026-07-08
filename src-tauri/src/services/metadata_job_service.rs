use crate::models::metadata_job::MetadataJob;

pub fn process_pending_jobs(
    conn: &rusqlite::Connection,
    app_handle: &tauri::AppHandle,
    batch_size: usize,
) -> rusqlite::Result<()> {
    let pending_jobs =
        crate::repositories::metadata_job_repository::get_pending_jobs(conn, batch_size)?;

    for job in pending_jobs {
        println!("Processing job id: {:?}", job.id);
        crate::repositories::metadata_job_repository::update_job_status(
            conn,
            job.id,
            "processing",
        )?;

        // process the job
        match process_job(conn, app_handle, &job) {
            Ok(_) => {
                println!("Job id {} processed successfully", job.id);
            }
            Err(err) => {
                println!("Error processing job id {}: {}", job.id, err);
            }
        }
    }

    Ok(())
}

fn execute_metadata_job<F>(
    conn: &rusqlite::Connection,
    job: &MetadataJob,
    processor: F,
) -> Result<(), String>
where
    F: FnOnce() -> Result<Option<String>, String>,
{
    match processor() {
        Ok(Some(path)) => {
            println!("File downloaded and saved at: {}", path);
            let _ = crate::repositories::metadata_job_repository::complete_job(conn, job.id);
        }

        Ok(None) => {
            println!("No file found for job id: {}", job.id);
            let _ = crate::repositories::metadata_job_repository::complete_job(conn, job.id);
        }

        Err(err) => {
            println!("Job failed for id {}: {}", job.id, err);
            let _ = crate::repositories::metadata_job_repository::fail_job(conn, job.id, &err);
        }
    }
    Ok(())
}

fn process_job(
    conn: &rusqlite::Connection,
    app_handle: &tauri::AppHandle,
    job: &MetadataJob,
) -> Result<(), String> {
    match job.job_type.as_str() {
        "album_cover" => execute_metadata_job(conn, job, || {
            process_album_cover_job(conn, app_handle, job.entity_id)
        }),

        "artist_image" => execute_metadata_job(conn, job, || {
            process_artist_image_job(conn, app_handle, job.entity_id)
        }),

        _ => {
            let err = format!("Unknown job type {}", job.job_type);

            let _ = crate::repositories::metadata_job_repository::fail_job(conn, job.id, &err);

            Err(err)
        }
    }
}

fn process_album_cover_job(
    conn: &rusqlite::Connection,
    app_handle: &tauri::AppHandle,
    id: i64,
) -> Result<Option<String>, String> {
    let album = crate::repositories::album_repository::get(conn, id).map_err(|e| e.to_string())?;

    match crate::services::file_service::ensure_album_cover(conn, app_handle, album) {
        Ok(Some(path)) => Ok(Some(path)),
        Ok(None) => Ok(None),
        Err(err) => Err(err),
    }
}

fn process_artist_image_job(
    conn: &rusqlite::Connection,
    app_handle: &tauri::AppHandle,
    id: i64,
) -> Result<Option<String>, String> {
    let artist =
        crate::repositories::artist_repository::get(conn, id).map_err(|e| e.to_string())?;

    match crate::services::file_service::ensure_artist_image(conn, app_handle, artist) {
        Ok(Some(path)) => Ok(Some(path)),
        Ok(None) => Ok(None),
        Err(err) => Err(err),
    }
}

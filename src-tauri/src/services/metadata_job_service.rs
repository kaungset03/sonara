pub fn process_pending_jobs(
    conn: &rusqlite::Connection,
    app_handle: &tauri::AppHandle,
) -> rusqlite::Result<()> {
    let pending_jobs = crate::repositories::metadata_job_repository::get_pending_jobs(conn, 30)?;

    for job in pending_jobs {
        println!("Processing job: {:?}", job);
        crate::repositories::metadata_job_repository::update_job_status(
            conn,
            job.id,
            "processing",
            None,
        )?;

        // process the job
        match process_job(conn, app_handle, &job) {
            Ok(_) => {
                println!("Job processed successfully");
            }
            Err(err) => {
                println!("Error processing job: {}", err);
            }
        }
    }

    Ok(())
}

fn process_job(
    conn: &rusqlite::Connection,
    app_handle: &tauri::AppHandle,
    job: &crate::models::metadata_job::MetadataJob,
) -> Result<(), String> {
    // process the job based on its type
    match job.job_type.as_str() {
        "album_cover" => match process_album_cover_job(conn, app_handle, job.entity_id) {
            Ok(Some(path)) => {
                println!("Album cover downloaded and saved at: {}", path);
                crate::repositories::metadata_job_repository::update_job_status(
                    conn,
                    job.id,
                    "completed",
                    None,
                )
                .map_err(|e| e.to_string())?;
                Ok(())
            }
            Ok(None) => {
                println!("Album cover not found for entity id: {}", job.entity_id);
                crate::repositories::metadata_job_repository::update_job_status(
                    conn,
                    job.id,
                    "completed",
                    None,
                )
                .map_err(|e| e.to_string())?;
                Ok(())
            }
            Err(err) => {
                println!("Error processing album cover job: {}", err);
                crate::repositories::metadata_job_repository::update_job_status(
                    conn,
                    job.id,
                    "failed",
                    Some(&err),
                )
                .map_err(|e| e.to_string())?;
                Err(err)
            }
        },
        _ => {
            let err_msg = format!("Unknown job type: {}", job.job_type);
            println!("{}", err_msg);
            crate::repositories::metadata_job_repository::update_job_status(
                conn,
                job.id,
                "failed",
                Some(&err_msg),
            )
            .map_err(|e| e.to_string())?;
            Err(err_msg)
        }
    }
}

fn process_album_cover_job(
    conn: &rusqlite::Connection,
    app_handle: &tauri::AppHandle,
    id: i64,
) -> Result<Option<String>, String> {
    let album = crate::repositories::album_repository::get(conn, id).map_err(|e| e.to_string())?;

    match crate::services::api_service::get_cover_art_from_music_brainz(
        &album.artist_name,
        &album.name,
    ) {
        Ok(Some(url)) => {
            // Download and save
            let saved_path = crate::services::file_service::download_and_save_file(
                &url,
                format!("album_{}_cover.jpg", album.id),
                app_handle,
            )?;

            crate::repositories::album_repository::update_cover_path(
                conn,
                album.id,
                &saved_path,
                "found",
            )
            .map_err(|e| e.to_string())?;

            return Ok(Some(saved_path));
        }
        Ok(None) => {
            crate::repositories::album_repository::update_cover_status(conn, album.id, "not_found")
                .map_err(|e| e.to_string())?;
            return Ok(None);
        }
        Err(err) => {
            return Err(err);
        }
    }
}

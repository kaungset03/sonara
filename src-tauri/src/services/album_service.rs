use crate::{
    models::album::AlbumDetails,
    repositories::{album_repository, song_repository},
};

// get all albums
pub fn get_all_albums(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::album::Album>> {
    album_repository::index(conn)
}

// get album details (info and songs)
pub fn get_album_details(
    conn: &rusqlite::Connection,
    album_id: i64,
) -> rusqlite::Result<AlbumDetails> {
    // update the metadata_job of the album by increasing priority and setting status to pending
    crate::repositories::metadata_job_repository::increase_job_priority(
        conn,
        "album",
        album_id,
        "album_cover",
    )?;

    let album =
        album_repository::get(conn, album_id).map_err(|_| rusqlite::Error::QueryReturnedNoRows)?;

    // let album_clone = album.clone();
    // let app_handle = app.clone();

    // tauri::async_runtime::spawn_blocking(move || {
    //     if let Ok(bg_conn) = crate::db::connection::get_connection(&app_handle) {
    //         let _ = crate::services::file_service::ensure_album_cover(
    //             &bg_conn,
    //             &app_handle,
    //             album_clone,
    //         );
    //     }
    // });

    let songs = song_repository::get_by_album(conn, album_id)?;
    Ok(AlbumDetails {
        album: album,
        songs,
    })
}

// search albums by name
pub fn search_albums(
    conn: &rusqlite::Connection,
    query: &str,
) -> rusqlite::Result<Vec<crate::models::search::LiveSearchResult>> {
    album_repository::search_by_name(conn, query)
}

// update album cover
pub fn update_album_cover(
    app: &tauri::AppHandle,
    conn: &rusqlite::Connection,
    album_id: i64,
    image_path: &str,
) -> rusqlite::Result<()> {
    let saved_path = crate::services::file_service::save_file_to_app_data(
        app,
        image_path.to_string(),
        format!("album_{}_cover.jpg", album_id),
    );

    if let Ok(saved_image_path) = saved_path {
        album_repository::update_cover_path(conn, album_id, &saved_image_path, "found")?;
        Ok(())
    } else {
        Err(rusqlite::Error::InvalidQuery)
    }
}

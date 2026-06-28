use crate::{
    models::artist::ArtistDetails,
    repositories::{artist_repository, song_repository},
};

// get all artists
pub fn get_all_artists(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::artist::Artist>> {
    artist_repository::index(conn)
}

// get artist details (info and songs)
pub fn get_artist_details(
    app: &tauri::AppHandle,
    conn: &rusqlite::Connection,
    artist_id: i64,
) -> rusqlite::Result<ArtistDetails> {
    let artist = artist_repository::get(conn, artist_id)
        .map_err(|_| rusqlite::Error::QueryReturnedNoRows)?;

    let artist_clone = artist.clone();
    let app_handle = app.clone();

    tauri::async_runtime::spawn_blocking(move || {
        if let Ok(bg_conn) = crate::db::connection::get_connection(&app_handle) {
            let _ = crate::services::file_service::ensure_artist_image(
                &bg_conn,
                &app_handle,
                artist_clone,
            );
        }
    });

    let songs = song_repository::get_by_artist(conn, artist_id)?;
    Ok(ArtistDetails { artist, songs })
}

// update artist image
pub fn update_artist_image(
    app: &tauri::AppHandle,
    conn: &rusqlite::Connection,
    artist_id: i64,
    image_path: &str,
) -> rusqlite::Result<()> {
    let saved_path = crate::services::file_service::save_file_to_app_data(
        app,
        image_path.to_string(),
        format!("artist_{}_image.jpg", artist_id),
    );

    if let Ok(saved_image_path) = saved_path {
        artist_repository::update_image_path(conn, artist_id, &saved_image_path)?;
        Ok(())
    } else {
        Err(rusqlite::Error::InvalidQuery)
    }
}

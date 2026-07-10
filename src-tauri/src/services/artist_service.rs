use crate::{
    models::artist::ArtistDetails,
    repositories::{artist_repository, song_repository},
};

// get all artists
pub fn get_all_artists(
    conn: &rusqlite::Connection,
    sort_col: &str,
    order_direction: &str,
) -> rusqlite::Result<Vec<crate::models::artist::Artist>> {
    artist_repository::index(conn, sort_col, order_direction)
}

// get artist details (info and songs)
pub fn get_artist_details(
    conn: &rusqlite::Connection,
    artist_id: i64,
) -> rusqlite::Result<ArtistDetails> {
    crate::repositories::metadata_job_repository::increase_job_priority(
        conn,
        "artist",
        artist_id,
        "artist_image",
    )?;

    let artist = artist_repository::get(conn, artist_id)
        .map_err(|_| rusqlite::Error::QueryReturnedNoRows)?;

    let songs = song_repository::get_by_artist(conn, artist_id)?;
    Ok(ArtistDetails { artist, songs })
}

pub fn search_artists(
    conn: &rusqlite::Connection,
    query: &str,
) -> rusqlite::Result<Vec<crate::models::search::LiveSearchResult>> {
    artist_repository::search_by_name(conn, query)
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
        // delete metadata job for artist image
        crate::services::metadata_job_service::delete_artist_image_job(conn, artist_id);
        Ok(())
    } else {
        Err(rusqlite::Error::InvalidQuery)
    }
}

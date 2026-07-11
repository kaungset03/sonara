use crate::repositories::song_repository;

pub fn get_all_songs(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::song::SongResponse>> {
    song_repository::index(conn)
}

pub fn get_song_by_id(
    conn: &rusqlite::Connection,
    id: i64,
) -> rusqlite::Result<crate::models::song::SongResponse> {
    song_repository::get(conn, id)
}

pub fn get_songs_by_search(
    conn: &rusqlite::Connection,
    query: &str,
) -> rusqlite::Result<Vec<crate::models::song::SongResponse>> {
    song_repository::search(conn, query)
}

pub fn update_song_info(
    conn: &mut rusqlite::Connection,
    id: i64,
    title: &str,
    album_name: &str,
    artist_name: &str,
    album_artist_name: &str,
    track_number: Option<i32>,
) -> rusqlite::Result<()> {
    let tx = conn.transaction()?;

    let title = title.trim();
    let artist_name = artist_name.trim();
    let album_name = album_name.trim();
    let album_artist_name = album_artist_name.trim();

    // Find or create the artist
    let (artist_id, is_new_artist) =
        crate::repositories::artist_repository::find_or_create(&tx, artist_name)?;
    if is_new_artist && artist_name != "Unknown Artist" {
        crate::services::metadata_job_service::insert_artist_image_job(&tx, artist_id);
    }

    let album_artist_id = if album_artist_name == artist_name {
        artist_id
    } else {
        let (album_artist_id, is_new_album_artist) =
            crate::repositories::artist_repository::find_or_create(&tx, album_artist_name)?;
        if is_new_album_artist && album_artist_name != "Unknown Artist" {
            crate::services::metadata_job_service::insert_artist_image_job(&tx, album_artist_id);
        }
        album_artist_id
    };

    let (album_id, is_new_album) =
        crate::repositories::album_repository::find_or_create(&tx, album_name, album_artist_id)?;

    if is_new_album && album_name != "Unknown Album" {
        crate::services::metadata_job_service::insert_album_cover_job(&tx, album_id);
    }

    crate::repositories::song_repository::update_info(
        &tx,
        id,
        title,
        album_id,
        artist_id,
        track_number,
    )?;

    // update the song lyrics status to "not_checked"
    crate::repositories::lyrics_repository::update_lyrics_status(&tx, id, "not_checked")?;

    tx.commit()?;

    Ok(())
}

pub fn set_favorite_song(
    conn: &rusqlite::Connection,
    song_id: i64,
    is_favorite: bool,
) -> rusqlite::Result<String> {
    song_repository::update_favorite_status(conn, song_id, is_favorite)
}

pub fn get_favorite_songs(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::song::SongResponse>> {
    song_repository::get_favorites(conn)
}

pub fn record_song_play(conn: &rusqlite::Connection, song_id: i64) -> rusqlite::Result<()> {
    song_repository::record_play(conn, song_id)
}

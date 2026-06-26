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
    conn: &rusqlite::Connection,
    artist_id: i64,
) -> rusqlite::Result<ArtistDetails> {
    let artist = artist_repository::get(conn, artist_id);
    if artist.is_err() {
        return Err(rusqlite::Error::QueryReturnedNoRows);
    }
    let songs = song_repository::get_by_artist(conn, artist_id)?;
    Ok(ArtistDetails {
        artist: artist.unwrap(),
        songs,
    })
}

// update artist image
pub fn update_artist_image(
    conn: &rusqlite::Connection,
    artist_id: i64,
    image_path: &str,
) -> rusqlite::Result<()> {
    // TODO: artwork service to store image and get the image path stored in app data
    artist_repository::update_image_path(conn, artist_id, image_path)
}

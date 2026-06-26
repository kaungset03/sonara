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
    let album = album_repository::get(conn, album_id);
    if album.is_err() {
        return Err(rusqlite::Error::QueryReturnedNoRows);
    }
    let songs = song_repository::get_by_album(conn, album_id)?;
    Ok(AlbumDetails {
        album: album.unwrap(),
        songs,
    })
}

// update album artwork
pub fn update_album_artwork(
    conn: &rusqlite::Connection,
    album_id: i64,
    image_path: &str,
) -> rusqlite::Result<()> {
    // TODO: artwork service to store image and get the image path stored in app data
    album_repository::update_artwork_path(conn, album_id, image_path)
}

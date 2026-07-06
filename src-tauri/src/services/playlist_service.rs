use crate::{
    models::playlist::PlaylistDetails,
    repositories::{playlist_repository, song_repository},
};

// create new playlist
pub fn create_playlist(conn: &rusqlite::Connection, name: &str) -> rusqlite::Result<i64> {
    playlist_repository::create(conn, name)
}

// get all playlists
pub fn get_all_playlists(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::playlist::Playlist>> {
    playlist_repository::index(conn)
}

// edit playlist
pub fn edit_playlist(
    conn: &rusqlite::Connection,
    playlist_id: i64,
    new_name: &str,
) -> rusqlite::Result<()> {
    playlist_repository::update(conn, playlist_id, new_name)
}

// delete playlist
pub fn delete_playlist(conn: &rusqlite::Connection, playlist_id: i64) -> rusqlite::Result<()> {
    playlist_repository::delete(conn, playlist_id)
}

pub fn get_playlist_details(
    conn: &rusqlite::Connection,
    playlist_id: i64,
) -> rusqlite::Result<PlaylistDetails> {
    let playlist = playlist_repository::get(conn, playlist_id);
    if playlist.is_err() {
        return Err(rusqlite::Error::QueryReturnedNoRows);
    }
    let songs = song_repository::get_by_playlist(conn, playlist_id)?;
    Ok(PlaylistDetails {
        playlist: playlist.unwrap(),
        songs,
    })
}

// add songs to playlist
pub fn add_songs_to_playlist(
    conn: &mut rusqlite::Connection,
    playlist_id: i64,
    song_ids: &[i64],
) -> rusqlite::Result<crate::models::playlist::AddSongsResult> {
    playlist_repository::add_songs_to_playlist_query(conn, playlist_id, song_ids)
}

// remove song from playlist
pub fn remove_song_from_playlist(
    conn: &mut rusqlite::Connection,
    playlist_id: i64,
    song_ids: &[i64],
) -> rusqlite::Result<()> {
    playlist_repository::remove_songs_from_playlist_query(conn, playlist_id, song_ids)
}

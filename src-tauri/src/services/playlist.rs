use crate::repositories::playlist_repository;

// create new playlist
pub fn create_playlist(conn: &rusqlite::Connection, name: &str) -> rusqlite::Result<i64> {
    playlist_repository::create_playlist_query(conn, name)
}

// get all playlists
pub fn get_all_playlists(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::playlist::Playlist>> {
    playlist_repository::get_all_playlists_query(conn)
}

// edit playlist
pub fn edit_playlist(
    conn: &rusqlite::Connection,
    playlist_id: i64,
    new_name: &str,
) -> rusqlite::Result<()> {
    playlist_repository::edit_playlist_query(conn, playlist_id, new_name)
}

// delete playlist
pub fn delete_playlist(conn: &rusqlite::Connection, playlist_id: i64) -> rusqlite::Result<()> {
    playlist_repository::delete_playlist_query(conn, playlist_id)
}

// get songs by playlist
pub fn get_songs_by_playlist(
    conn: &rusqlite::Connection,
    playlist_id: i64,
) -> rusqlite::Result<Vec<crate::models::song::Song>> {
    playlist_repository::get_songs_by_playlist_query(conn, playlist_id)
}

// add songs to playlist
pub fn add_songs_to_playlist(
    conn: &mut rusqlite::Connection,
    playlist_id: i64,
    song_ids: &[i64],
) -> rusqlite::Result<()> {
    playlist_repository::add_songs_to_playlist_query(conn, playlist_id, song_ids)
}

// remove song from playlist
pub fn remove_song_from_playlist(
    conn: &rusqlite::Connection,
    playlist_id: i64,
    song_id: i64,
) -> rusqlite::Result<()> {
    playlist_repository::remove_song_from_playlist_query(conn, playlist_id, song_id)
}

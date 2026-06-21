use crate::repositories::song_repository;

pub fn get_all_songs(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::song::Song>> {
    song_repository::get_all_songs_query(conn)
}

pub fn get_song_by_id(
    conn: &rusqlite::Connection,
    id: i32,
) -> rusqlite::Result<Option<crate::models::song::Song>> {
    song_repository::get_song_by_id_query(conn, id)
}

pub fn get_all_artists(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::artist::Artist>> {
    song_repository::get_all_artists_query(conn)
}

pub fn get_all_albums(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::album::Album>> {
    song_repository::get_all_albums_query(conn)
}

pub fn get_songs_by_artist(
    conn: &rusqlite::Connection,
    artist: &str,
) -> rusqlite::Result<Vec<crate::models::song::Song>> {
    song_repository::get_songs_by_artist_query(conn, artist)
}

pub fn get_songs_by_album(
    conn: &rusqlite::Connection,
    album: &str,
) -> rusqlite::Result<Vec<crate::models::song::Song>> {
    song_repository::get_songs_by_album_query(conn, album)
}

pub fn set_favorite_song(
    conn: &rusqlite::Connection,
    song_id: i32,
    is_favorite: bool,
) -> rusqlite::Result<()> {
    song_repository::set_favorite_song_query(conn, song_id, is_favorite)
}

pub fn get_favorite_songs(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::song::Song>> {
    song_repository::get_favorite_songs_query(conn)
}

pub fn record_song_play(conn: &rusqlite::Connection, song_id: i32) -> rusqlite::Result<()> {
    song_repository::record_song_play_query(conn, song_id)
}

pub fn update_song_lyrics_path(
    conn: &rusqlite::Connection,
    song_id: i32,
    lyrics_path: &str,
) -> rusqlite::Result<()> {
    song_repository::update_lyrics_path_by_song_id_query(conn, song_id, lyrics_path)
}

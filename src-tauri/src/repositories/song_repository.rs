use rusqlite::{params, Connection};

use crate::models::song::Song;

fn song_from_row(row: &rusqlite::Row) -> rusqlite::Result<Song> {
    Ok(Song {
        id: row.get("id")?,
        title: row.get("title")?,
        duration: row.get("duration")?,
        path: row.get("path")?,
        is_favorite: row.get::<_, i32>("is_favorite")? != 0,
        favorite_added_at: row.get("favorite_added_at")?,
        track_number: row.get("track_number")?,
        last_played_at: row.get("last_played_at")?,
        play_count: row.get("play_count")?,
        lyrics_path: row.get("lyrics_path")?,
        created_at: row.get("created_at")?,
        file_modified_at: row.get("file_modified_at")?,
        file_size: row.get("file_size")?,
        folder_id: row.get("folder_id")?,
        album_id: row.get("album_id")?,
        artist_id: row.get("artist_id")?,
    })
}

// get all the songs from the database
pub fn index(conn: &Connection) -> rusqlite::Result<Vec<Song>> {
    let mut stmt = conn.prepare("SELECT * FROM songs")?;
    let song_iter = stmt.query_map([], |row| song_from_row(row))?;

    let songs = song_iter.collect();
    songs
}

// get songs by album id
pub fn get_by_album(conn: &Connection, album_id: i64) -> rusqlite::Result<Vec<Song>> {
    let mut stmt = conn.prepare("SELECT * FROM songs WHERE album_id = ?1")?;
    let song_iter = stmt.query_map(params![album_id], |row| song_from_row(row))?;

    let songs = song_iter.collect();
    songs
}

// get songs by artist id
pub fn get_by_artist(conn: &Connection, artist_id: i64) -> rusqlite::Result<Vec<Song>> {
    let mut stmt = conn.prepare("SELECT * FROM songs WHERE artist_id = ?1")?;
    let song_iter = stmt.query_map(params![artist_id], |row| song_from_row(row))?;

    let songs = song_iter.collect();
    songs
}

// get songs by playlist id
pub fn get_by_playlist(conn: &Connection, playlist_id: i64) -> rusqlite::Result<Vec<Song>> {
    let mut stmt = conn.prepare(
        "SELECT s.* FROM songs s
         INNER JOIN playlist_songs ps ON s.id = ps.song_id
         WHERE ps.playlist_id = ?1",
    )?;
    let song_iter = stmt.query_map(params![playlist_id], |row| song_from_row(row))?;

    let songs = song_iter.collect();
    songs
}

// get a song by id
pub fn get(conn: &Connection, id: i64) -> rusqlite::Result<Song> {
    let mut stmt = conn.prepare("SELECT * FROM songs WHERE id = ?1")?;
    let song = stmt.query_row(params![id], |row| song_from_row(row))?;
    Ok(song)
}

// create a new song
pub fn create(
    conn: &Connection,
    title: &str,
    duration: i64,
    path: &str,
    track_number: Option<i32>,
    folder_id: i64,
    album_id: i64,
    artist_id: i64,
    file_modified_at: i64,
    file_size: i64,
) -> rusqlite::Result<()> {
    let created_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    conn.execute(
        "INSERT INTO songs (title, duration, path, track_number, created_at, folder_id, album_id, artist_id, file_modified_at, file_size) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
        params![title, duration, path, track_number, created_at, folder_id, album_id, artist_id, file_modified_at, file_size],
    )?;
    Ok(())
}

// search
pub fn search(conn: &Connection, query: &str) -> rusqlite::Result<Vec<Song>> {
    let mut stmt = conn.prepare("SELECT * FROM songs WHERE title LIKE ?1")?;
    let song_iter = stmt.query_map(params![format!("%{}%", query)], |row| song_from_row(row))?;

    let songs = song_iter.collect();
    songs
}

// update favorite status of a song by id
pub fn update_favorite_status(
    conn: &Connection,
    id: i64,
    is_favorite: bool,
) -> rusqlite::Result<String> {
    let favorite_added_at = if is_favorite {
        Some(
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs() as i64,
        )
    } else {
        None
    };

    conn.execute(
        "UPDATE songs SET is_favorite = ?1, favorite_added_at = ?2 WHERE id = ?3",
        params![is_favorite as i32, favorite_added_at, id],
    )?;
    Ok(if is_favorite {
        "Song marked as favorite".to_string()
    } else {
        "Song removed from favorites".to_string()
    })
}

// update lyrics path of a song by id
pub fn update_lyrics_path(conn: &Connection, id: i64, lyrics_path: &str) -> rusqlite::Result<()> {
    conn.execute(
        "UPDATE songs SET lyrics_path = ?1 WHERE id = ?2",
        params![lyrics_path, id],
    )?;
    Ok(())
}

// update last played at and play count of a song by id
pub fn record_play(conn: &Connection, id: i64) -> rusqlite::Result<()> {
    let last_played_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    conn.execute(
        "UPDATE songs SET last_played_at = ?1, play_count = play_count + 1 WHERE id = ?2",
        params![last_played_at, id],
    )?;
    Ok(())
}

// get all favorite songs
pub fn get_favorites(conn: &Connection) -> rusqlite::Result<Vec<Song>> {
    let mut stmt = conn.prepare("SELECT * FROM songs WHERE is_favorite = 1")?;
    let song_iter = stmt.query_map([], |row| song_from_row(row))?;

    let songs = song_iter.collect();
    songs
}

// get recently played songs
pub fn get_recently_played(conn: &Connection, limit: usize) -> rusqlite::Result<Vec<Song>> {
    let mut stmt = conn.prepare(
        "SELECT * FROM songs WHERE last_played_at IS NOT NULL ORDER BY last_played_at DESC LIMIT ?1",
    )?;
    let song_iter = stmt.query_map([limit], |row| song_from_row(row))?;

    let songs = song_iter.collect();
    songs
}

// get recently added songs
pub fn get_recently_added(conn: &Connection, limit: usize) -> rusqlite::Result<Vec<Song>> {
    let mut stmt = conn.prepare("SELECT * FROM songs ORDER BY created_at DESC LIMIT ?1")?;
    let song_iter = stmt.query_map([limit], |row| song_from_row(row))?;

    let songs = song_iter.collect();
    songs
}

// get most played songs
pub fn get_most_played(conn: &Connection, limit: usize) -> rusqlite::Result<Vec<Song>> {
    let mut stmt = conn.prepare(
        "SELECT * FROM songs WHERE play_count > 0 ORDER BY play_count DESC, last_played_at DESC LIMIT ?1",
    )?;
    let song_iter = stmt.query_map([limit], |row| song_from_row(row))?;

    let songs = song_iter.collect();
    songs
}

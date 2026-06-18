use crate::models::stats::Stats;

// insert song metadata into the database
pub fn insert_song_metadata(
    conn: &rusqlite::Connection,
    title: &str,
    artist: &str,
    album: &str,
    path: &str,
    is_favorite: i32,
    favorite_added_at: Option<i64>,
    duration: i64,
) -> rusqlite::Result<()> {
    let created_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    conn.execute(
        "INSERT INTO songs (title, artist, album, duration, path, is_favorite, favorite_added_at, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        rusqlite::params![title, artist, album, duration, path, is_favorite, favorite_added_at, created_at],
    )?;
    Ok(())
}

// get the song metadata from the database
pub fn get_all_songs_query(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::song::Song>> {
    let mut stmt =
        conn.prepare("SELECT id, title, artist, album, duration, path, is_favorite, favorite_added_at, last_played_at, play_count, created_at FROM songs")?;
    let song_iter = stmt.query_map([], |row| {
        Ok(crate::models::song::Song {
            id: row.get(0)?,
            title: row.get(1)?,
            artist: row.get(2)?,
            album: row.get(3)?,
            duration: row.get(4)?,
            path: row.get(5)?,
            is_favorite: row.get::<_, i64>(6)? == 1,
            favorite_added_at: row.get(7)?,
            last_played_at: row.get(8)?,
            play_count: row.get(9)?,
            created_at: row.get(10)?,
        })
    })?;
    let songs: Result<Vec<crate::models::song::Song>, rusqlite::Error> = song_iter.collect();
    songs
}

// get all the artists from the database
pub fn get_all_artists_query(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::artist::Artist>> {
    let mut stmt = conn.prepare("SELECT artist, COUNT(*) as count FROM songs GROUP BY artist")?;
    let artist_iter = stmt.query_map([], |row| {
        Ok(crate::models::artist::Artist {
            name: row.get(0)?,
            count: row.get(1)?,
        })
    })?;
    let artists: Result<Vec<crate::models::artist::Artist>, rusqlite::Error> =
        artist_iter.collect();
    artists
}

// get all the albums from the database
pub fn get_all_albums_query(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::album::Album>> {
    let mut stmt = conn.prepare("SELECT album, COUNT(*) as count FROM songs GROUP BY album")?;
    let album_iter = stmt.query_map([], |row| {
        Ok(crate::models::album::Album {
            name: row.get(0)?,
            count: row.get(1)?,
        })
    })?;
    let albums: Result<Vec<crate::models::album::Album>, rusqlite::Error> = album_iter.collect();
    albums
}

// get songs by artist
pub fn get_songs_by_artist_query(
    conn: &rusqlite::Connection,
    artist: &str,
) -> rusqlite::Result<Vec<crate::models::song::Song>> {
    let mut stmt = conn.prepare(
        "SELECT id, title, artist, album, duration, path, is_favorite, favorite_added_at, last_played_at, play_count, created_at FROM songs WHERE artist = ?1",
    )?;
    let song_iter = stmt.query_map([artist], |row| {
        Ok(crate::models::song::Song {
            id: row.get(0)?,
            title: row.get(1)?,
            artist: row.get(2)?,
            album: row.get(3)?,
            duration: row.get(4)?,
            path: row.get(5)?,
            is_favorite: row.get::<_, i64>(6)? == 1,
            favorite_added_at: row.get(7)?,
            last_played_at: row.get(8)?,
            play_count: row.get(9)?,
            created_at: row.get(10)?,
        })
    })?;
    let songs: Result<Vec<crate::models::song::Song>, rusqlite::Error> = song_iter.collect();
    songs
}

// get songs by album
pub fn get_songs_by_album_query(
    conn: &rusqlite::Connection,
    album: &str,
) -> rusqlite::Result<Vec<crate::models::song::Song>> {
    let mut stmt = conn.prepare(
        "SELECT id, title, artist, album, duration, path, is_favorite, favorite_added_at, last_played_at, play_count, created_at FROM songs WHERE album = ?1",
    )?;
    let song_iter = stmt.query_map([album], |row| {
        Ok(crate::models::song::Song {
            id: row.get(0)?,
            title: row.get(1)?,
            artist: row.get(2)?,
            album: row.get(3)?,
            duration: row.get(4)?,
            path: row.get(5)?,
            is_favorite: row.get::<_, i64>(6)? == 1,
            favorite_added_at: row.get(7)?,
            last_played_at: row.get(8)?,
            play_count: row.get(9)?,
            created_at: row.get(10)?,
        })
    })?;
    let songs: Result<Vec<crate::models::song::Song>, rusqlite::Error> = song_iter.collect();
    songs
}

// set favorite song
pub fn set_favorite_song_query(
    conn: &rusqlite::Connection,
    song_id: i32,
    is_favorite: bool,
) -> rusqlite::Result<()> {
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
        rusqlite::params![is_favorite as i32, favorite_added_at, song_id],
    )?;
    Ok(())
}

// get favorite songs
pub fn get_favorite_songs_query(
    conn: &rusqlite::Connection,
) -> rusqlite::Result<Vec<crate::models::song::Song>> {
    let mut stmt = conn.prepare(
        "SELECT id, title, artist, album, duration, path, is_favorite, favorite_added_at, last_played_at, play_count, created_at FROM songs WHERE is_favorite = 1 ORDER BY favorite_added_at",
    )?;
    let song_iter = stmt.query_map([], |row| {
        Ok(crate::models::song::Song {
            id: row.get(0)?,
            title: row.get(1)?,
            artist: row.get(2)?,
            album: row.get(3)?,
            duration: row.get(4)?,
            path: row.get(5)?,
            is_favorite: row.get::<_, i64>(6)? == 1,
            favorite_added_at: row.get(7)?,
            last_played_at: row.get(8)?,
            play_count: row.get(9)?,
            created_at: row.get(10)?,
        })
    })?;
    let songs: Result<Vec<crate::models::song::Song>, rusqlite::Error> = song_iter.collect();
    songs
}

pub fn get_recently_added_songs_query(
    conn: &rusqlite::Connection,
    limit: i64,
) -> rusqlite::Result<Vec<crate::models::song::Song>> {
    let mut stmt = conn.prepare(
        "SELECT id, title, artist, album, duration, path, is_favorite, favorite_added_at, last_played_at, play_count, created_at FROM songs ORDER BY created_at DESC LIMIT ?1",
    )?;
    let song_iter = stmt.query_map([limit], |row| {
        Ok(crate::models::song::Song {
            id: row.get(0)?,
            title: row.get(1)?,
            artist: row.get(2)?,
            album: row.get(3)?,
            duration: row.get(4)?,
            path: row.get(5)?,
            is_favorite: row.get::<_, i64>(6)? == 1,
            favorite_added_at: row.get(7)?,
            last_played_at: row.get(8)?,
            play_count: row.get(9)?,
            created_at: row.get(10)?,
        })
    })?;
    let songs: Result<Vec<crate::models::song::Song>, rusqlite::Error> = song_iter.collect();
    songs
}

pub fn get_recently_played_songs_query(
    conn: &rusqlite::Connection,
    limit: i64,
) -> rusqlite::Result<Vec<crate::models::song::Song>> {
    let mut stmt = conn.prepare(
        "SELECT id, title, artist, album, duration, path, is_favorite, favorite_added_at, last_played_at, play_count, created_at FROM songs WHERE last_played_at IS NOT NULL ORDER BY last_played_at DESC LIMIT ?1",
    )?;
    let song_iter = stmt.query_map([limit], |row| {
        Ok(crate::models::song::Song {
            id: row.get(0)?,
            title: row.get(1)?,
            artist: row.get(2)?,
            album: row.get(3)?,
            duration: row.get(4)?,
            path: row.get(5)?,
            is_favorite: row.get::<_, i64>(6)? == 1,
            favorite_added_at: row.get(7)?,
            last_played_at: row.get(8)?,
            play_count: row.get(9)?,
            created_at: row.get(10)?,
        })
    })?;
    let songs: Result<Vec<crate::models::song::Song>, rusqlite::Error> = song_iter.collect();
    songs
}

pub fn get_most_played_songs_query(
    conn: &rusqlite::Connection,
    limit: i64,
) -> rusqlite::Result<Vec<crate::models::song::Song>> {
    let mut stmt = conn.prepare(
        "SELECT id, title, artist, album, duration, path, is_favorite, favorite_added_at, last_played_at, play_count, created_at FROM songs WHERE play_count > 0 ORDER BY play_count DESC LIMIT ?1",
    )?;
    let song_iter = stmt.query_map([limit], |row| {
        Ok(crate::models::song::Song {
            id: row.get(0)?,
            title: row.get(1)?,
            artist: row.get(2)?,
            album: row.get(3)?,
            duration: row.get(4)?,
            path: row.get(5)?,
            is_favorite: row.get::<_, i64>(6)? == 1,
            favorite_added_at: row.get(7)?,
            last_played_at: row.get(8)?,
            play_count: row.get(9)?,
            created_at: row.get(10)?,
        })
    })?;
    let songs: Result<Vec<crate::models::song::Song>, rusqlite::Error> = song_iter.collect();
    songs
}

pub fn get_stats_query(conn: &rusqlite::Connection) -> rusqlite::Result<Stats> {
    let total_songs = conn.query_row("SELECT COUNT(*) FROM songs", [], |row| row.get(0))?;
    let total_albums = conn.query_row("SELECT COUNT(DISTINCT album) FROM songs", [], |row| {
        row.get(0)
    })?;
    let total_artists = conn.query_row("SELECT COUNT(DISTINCT artist) FROM songs", [], |row| {
        row.get(0)
    })?;
    let total_favorites = conn.query_row(
        "SELECT COUNT(*) FROM songs WHERE is_favorite = 1",
        [],
        |row| row.get(0),
    )?;

    Ok(Stats {
        total_songs,
        total_albums,
        total_artists,
        total_favorites,
    })
}

pub fn record_song_play_query(conn: &rusqlite::Connection, song_id: i32) -> rusqlite::Result<()> {
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    conn.execute(
        "UPDATE songs SET last_played_at = ?1, play_count = play_count + 1 WHERE id = ?2",
        rusqlite::params![now, song_id],
    )?;
    Ok(())
}

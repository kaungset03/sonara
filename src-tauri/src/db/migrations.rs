use rusqlite::{Connection, Result};

pub fn run_migrations(conn: &Connection) -> Result<()> {
    conn.execute(
        "
            CREATE TABLE IF NOT EXISTS library_folders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT UNIQUE NOT NULL,
            created_at INTEGER NOT NULL
        )",
        [],
    )?;

    // Artists Table
    conn.execute(
        "
            CREATE TABLE IF NOT EXISTS artists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            image_path TEXT DEFAULT NULL,
            image_status TEXT CHECK (image_status IN ('not_checked', 'found', 'not_found')) NOT NULL DEFAULT 'not_checked',
            created_at INTEGER NOT NULL
        )",
        [],
    )?;

    // Albums Table
    conn.execute(
        "
            CREATE TABLE IF NOT EXISTS albums (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            artist_id INTEGER NOT NULL DEFAULT 1,
            cover_path TEXT DEFAULT NULL,
            cover_status TEXT CHECK (cover_status IN ('not_checked', 'found', 'not_found')) NOT NULL DEFAULT 'not_checked',
            created_at INTEGER NOT NULL,
            FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE SET DEFAULT,
            UNIQUE(name, artist_id)
        )",
        [],
    )?;

    conn.execute(
        "
            CREATE TABLE IF NOT EXISTS songs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            duration INTEGER NOT NULL,
            path TEXT UNIQUE NOT NULL,

            is_favorite INTEGER NOT NULL DEFAULT 0 CHECK (is_favorite IN (0,1)),
            favorite_added_at INTEGER,

            track_number INTEGER,
            last_played_at INTEGER,
            play_count INTEGER NOT NULL DEFAULT 0,

            created_at INTEGER NOT NULL,
            file_modified_at INTEGER NOT NULL,
            file_size INTEGER NOT NULL,

            folder_id INTEGER,

            album_id INTEGER NOT NULL DEFAULT 1,
            artist_id INTEGER NOT NULL DEFAULT 1,

            FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE SET DEFAULT,
            FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE SET DEFAULT,
            FOREIGN KEY (folder_id) REFERENCES library_folders(id) ON DELETE CASCADE
        )",
        [],
    )?;

    // Create lyrics table
    conn.execute(
        "
            CREATE TABLE IF NOT EXISTS lyrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            song_id INTEGER NOT NULL UNIQUE,
            path TEXT NOT NULL,
            status TEXT CHECK (status IN ('not_checked', 'found', 'not_found')) NOT NULL DEFAULT 'not_checked',
            created_at INTEGER NOT NULL,
            FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
        )",
        [],
    )?;

    // Create the 'playlists' table
    conn.execute(
        "
            CREATE TABLE IF NOT EXISTS playlists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            created_at INTEGER NOT NULL
        )",
        [],
    )?;

    // Create the 'playlist_songs' table
    conn.execute(
        "
            CREATE TABLE IF NOT EXISTS playlist_songs (
            playlist_id INTEGER NOT NULL,
            song_id INTEGER NOT NULL,
            created_at INTEGER NOT NULL,
            PRIMARY KEY (playlist_id, song_id),
            FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
            FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
        )",
        [],
    )?;

    Ok(())
}

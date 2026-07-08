CREATE TABLE IF NOT EXISTS
    metadata_jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity_type TEXT CHECK (entity_type IN ('artist', 'album', 'song')) NOT NULL,
        entity_id INTEGER NOT NULL,
        job_type TEXT CHECK (
            job_type IN ('artist_image', 'album_cover', 'lyrics')
        ) NOT NULL,
        status TEXT CHECK (
            status IN ('pending', 'processing', 'completed', 'failed')
        ) NOT NULL DEFAULT 'pending',
        priority_lvl INTEGER NOT NULL DEFAULT 0,
        attempt_count INTEGER NOT NULL DEFAULT 0,
        last_error TEXT DEFAULT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        UNIQUE (entity_type, entity_id, job_type)
    );
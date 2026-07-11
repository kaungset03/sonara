CREATE INDEX IF NOT EXISTS idx_songs_album_id ON songs (album_id);


CREATE INDEX IF NOT EXISTS idx_songs_artist_id ON songs (artist_id);


CREATE INDEX IF NOT EXISTS idx_songs_folder_id ON songs (folder_id);


CREATE INDEX IF NOT EXISTS idx_lyrics_song_id ON song_lyrics (song_id);
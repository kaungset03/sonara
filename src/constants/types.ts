declare global {
  type Song = {
    id: number;
    title: string;
    artist: string;
    album: string;
    duration: number; // in seconds
    path: string; // file path to the song
    lyrics_path: string | null; // file path to the lyrics, if available
    is_favorite: boolean; // whether the song is marked as favorite
    favorite_added_at: number | null; // timestamp when the song was marked as favorite
    last_played_at: number | null; // timestamp when the song was last played
    play_count: number; // number of times the song has been played
    created_at: number; // timestamp when the song was added to the library
  };

  type Artist = {
    name: string;
    count: number; // number of songs by the artist
  };

  type Album = {
    name: string;
    count: number; // number of songs in the album
  };

  type Playlist = {
    id: number;
    name: string;
  };

  type QueueItem = {
    id: string; // unique id for the queue item
    songId: number; // reference to the song id
  };

  type Stats = {
    total_songs: number;
    total_albums: number;
    total_artists: number;
    total_favorites: number;
  };

  type HomeData = {
    stats: Stats;
    recently_added_songs: Song[];
    most_played_songs: Song[];
    recently_played_songs: Song[];
  };

  type SearchResults = {
    songs: Song[];
    artists: Artist[];
    albums: Album[];
  };

  type Theme = "dark" | "light" | "system";

  type Color = {
    name: string;
    hex: string;
  };

  type ImportResult = {
    imported: number; // number of songs imported
    skipped: number; // number of songs skipped (already exist)
    failed: number; // number of songs failed to import
    removed: number; // number of songs removed
  };

  type ImportedFolder = {
    id: number;
    path: string;
    song_count: number; // number of songs found in the folder
    created_at: number; // timestamp when the folder was imported
  };

  type LyricLine = {
    time: number; // time in seconds when the lyric line should be displayed
    text: string; // the lyric text to display
  };
}

export {};

declare global {
  type Song = {
    id: number;
    title: string;
    artist_id: number;
    artist_name: string;
    album_id: number;
    album_name: string;
    album_cover_path: string | null; // file path to the album cover image, if available
    album_artist_name: string; // artist of the album, can be different from the song artist
    duration: number; // in seconds
    track_number: number; // track number in the album
    path: string; // file path to the song
    is_favorite: boolean; // whether the song is marked as favorite
    favorite_added_at: number | null; // timestamp when the song was marked as favorite
    last_played_at: number | null; // timestamp when the song was last played
    play_count: number; // number of times the song has been played
    created_at: number; // timestamp when the song was added to the library
  };

  type Artist = {
    id: number;
    name: string;
    image_path: string | null; // file path to the artist image, if available
  };

  type Album = {
    id: number;
    name: string;
    artist_id: number;
    artist_name: string;
    cover_path: string | null; // file path to the album cover image, if available
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

  type AppStats = {
    total_songs: number;
    total_albums: number;
    total_artists: number;
    total_folders: number;
    app_version: string;
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
    added: number; // number of files added to the library
    failed: number; // number of files that failed to be added
    removed: number; // number of files removed from the library
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

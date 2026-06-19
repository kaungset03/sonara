declare global {
  type Song = {
    id: number;
    title: string;
    artist: string;
    album: string;
    duration: number; // in seconds
    path: string; // file path to the song
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
}
export {};

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

  type SongColumn = "Title" | "Artist" | "Album" | "Duration";
}
export {};

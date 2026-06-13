declare global {
  type Song = {
    id: number;
    title: string;
    artist: string;
    album: string;
    duration: number; // in seconds
    path: string; // file path to the song
  };

  type Artist = {
    name: string;
    count: number; // number of songs by the artist
  };

  type Album = {
    name: string;
    count: number; // number of songs in the album
  };
}
export {};

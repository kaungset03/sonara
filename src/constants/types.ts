declare global {
  type Song = {
    id: number;
    title: string;
    artist: string;
    album: string;
    duration: number; // in seconds
    path: string; // file path to the song
  };
}
export {};

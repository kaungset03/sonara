import { create } from "zustand";
type PlayerStore = {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;

  setCurrentSong: (song: Song) => void;
  setIsPlaying: (playing: boolean) => void;
  setQueue: (songs: Song[]) => void;
};

const usePlayerStore = create<PlayerStore>()((set) => ({
  currentSong: null,
  queue: [],
  isPlaying: false,

  setCurrentSong: (song) => set({ currentSong: song }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setQueue: (songs) => set({ queue: songs }),
}));

export default usePlayerStore;

import { create } from "zustand";
type PlayerStore = {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  musicVolume: number;
  muted: boolean;

  setCurrentSong: (song: Song) => void;
  setMusicVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  setQueue: (songs: Song[]) => void;
};

const usePlayerStore = create<PlayerStore>()((set) => ({
  currentSong: null,
  queue: [],
  isPlaying: false,
  musicVolume: 1,
  muted: false,

  setCurrentSong: (song) => set({ currentSong: song }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setQueue: (songs) => set({ queue: songs }),
  setMusicVolume: (volume) => set({ musicVolume: volume }),
  setMuted: (muted) => set({ muted }),
}));

export default usePlayerStore;

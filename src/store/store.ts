import { create } from "zustand";
type PlayerStore = {
  currentSongId: number | null;
  queue: Song[];
  isPlaying: boolean;
  musicVolume: number;
  muted: boolean;

  setCurrentSongId: (id: number) => void;
  setMusicVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  setQueue: (songs: Song[]) => void;
};

const usePlayerStore = create<PlayerStore>()((set) => ({
  currentSongId: null,
  queue: [],
  isPlaying: false,
  musicVolume: 1,
  muted: false,

  setCurrentSongId: (id) => set({ currentSongId: id }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setQueue: (songs) => set({ queue: songs }),
  setMusicVolume: (volume) => set({ musicVolume: volume }),
  setMuted: (muted) => set({ muted }),
}));

export default usePlayerStore;

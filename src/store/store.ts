import { create } from "zustand";
type PlayerStore = {
  currentSongId: number | null;
  queue: QueueItem[];
  isPlaying: boolean;
  musicVolume: number;
  muted: boolean;

  setCurrentSongId: (id: number) => void;
  setMusicVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  setQueue: (queue: QueueItem[]) => void;
  addToQueue: (song: Song) => void;
  // removeFromQueue: (id: string) => void;
};

const usePlayerStore = create<PlayerStore>()((set) => ({
  currentSongId: null,
  queue: [],
  isPlaying: false,
  musicVolume: 1,
  muted: false,

  setCurrentSongId: (id) => set({ currentSongId: id }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setQueue: (queue) => set({ queue }),
  addToQueue: (song) =>
    set((state) => ({
      queue: [...state.queue, { id: crypto.randomUUID(), song }],
    })),
  setMusicVolume: (volume) => set({ musicVolume: volume }),
  setMuted: (muted) => set({ muted }),
}));

export default usePlayerStore;

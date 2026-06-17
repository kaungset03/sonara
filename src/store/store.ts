import { create } from "zustand";
import { shuffleQueue } from "@/lib/helpers";
type PlayerStore = {
  // currently playing song
  currentQueueItemId: string | null;

  // UI queue not affected by shuffle mode
  queue: QueueItem[];

  // actual playback queue (no shuffle: same as queue, shuffle: shuffled version of queue)
  playbackQueue: QueueItem[];

  // playback state
  isPlaying: boolean;
  isShuffle: boolean;
  muted: boolean;
  repeatedMode: "off" | "one" | "all";

  // Actions
  // main entry point for playing a song, sets the current song and queue
  playSong: (song: Song, songs: Song[]) => void;

  // select current song
  setCurrentQueueItemId: (id: string | null) => void;

  // set queue with new songs
  setQueue: (songs: Song[]) => void;

  // add to queue
  addToQueue: (song: Song) => void;

  // remove from queue
  removeFromQueue: (id: string) => void;

  // set playback queue
  setPlaybackQueue: (queue: QueueItem[]) => void;

  setIsPlaying: (isPlaying: boolean) => void;
  setIsShuffle: (isShuffle: boolean) => void;
  setMuted: (muted: boolean) => void;
  setRepeatedMode: (mode: "off" | "one" | "all") => void;

  next: () => void;
  previous: () => void;
};

const usePlayerStore = create<PlayerStore>()((set) => ({
  currentQueueItemId: null,
  queue: [],
  playbackQueue: [],
  isPlaying: false,
  isShuffle: false,
  muted: false,
  repeatedMode: "all",

  setCurrentQueueItemId: (id) => set({ currentQueueItemId: id }),

  playSong: (song, songs) => {
    set((state) => {
      // build queue items with unique ids
      const queue = songs.map((s) => ({ id: crypto.randomUUID(), song: s }));

      // build playback queue based on shuffle mode
      const playbackQueue = state.isShuffle ? shuffleQueue(queue) : queue;

      // find the queue item for the selected song
      const currentItem = queue.find((item) => item.song.id === song.id);

      return {
        queue,
        playbackQueue,
        currentQueueItemId: currentItem ? currentItem.id : null,
        isPlaying: true,
      };
    });
  },

  setQueue: (songs) => {
    const newQueue = songs.map((song) => ({ id: crypto.randomUUID(), song }));
    set({ queue: newQueue, playbackQueue: newQueue });
  },

  // add new song to both UI queue and playback queue
  addToQueue: (song) =>
    set((state) => {
      const newItem: QueueItem = { id: crypto.randomUUID(), song };
      return {
        queue: [...state.queue, newItem],
        playbackQueue: [...state.playbackQueue, newItem],
      };
    }),
  removeFromQueue: (queueItemId) =>
    set((state) => ({
      queue: state.queue.filter((item) => item.id !== queueItemId),
      playbackQueue: state.playbackQueue.filter(
        (item) => item.id !== queueItemId,
      ),
    })),
  setPlaybackQueue: (queue) => set({ playbackQueue: queue }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsShuffle: (isShuffle) =>
    set((state) => {
      const newPlaybackQueue = isShuffle
        ? shuffleQueue(state.queue)
        : state.queue;
      return { isShuffle, playbackQueue: newPlaybackQueue };
    }),
  setMuted: (muted) => set({ muted }),
  setRepeatedMode: (mode) => set({ repeatedMode: mode }),

  next: () =>
    set((state) => {
      const currentIndex = state.playbackQueue.findIndex(
        (item) => item.id === state.currentQueueItemId,
      );
      const nextIndex = (currentIndex + 1) % state.playbackQueue.length;
      return { currentQueueItemId: state.playbackQueue[nextIndex].id };
    }),
  previous: () =>
    set((state) => {
      const currentIndex = state.playbackQueue.findIndex(
        (item) => item.id === state.currentQueueItemId,
      );
      const previousIndex =
        (currentIndex - 1 + state.playbackQueue.length) %
        state.playbackQueue.length;
      return { currentQueueItemId: state.playbackQueue[previousIndex].id };
    }),
}));

export default usePlayerStore;

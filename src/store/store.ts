import { create } from "zustand";
import { shuffleQueue } from "@/lib/helpers";
type PlayerStore = {
  currentQueueItem: QueueItem | null;
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
  // main entry point for playing a song, sets the current queue item and queue
  playSong: (song: Song, songs: Song[]) => void;

  // select current song
  setCurrentQueueItem: (item: QueueItem | null) => void;

  // set queue with new songs
  // setQueue: (songs: Song[]) => void;

  // add to queue
  addToQueue: (song: Song) => void;

  // remove from queue
  removeFromQueue: (id: string) => void;

  // set playback queue
  // setPlaybackQueue: (queue: QueueItem[]) => void;

  setIsPlaying: (isPlaying: boolean) => void;
  setIsShuffle: (isShuffle: boolean) => void;
  setMuted: (muted: boolean) => void;
  setRepeatedMode: (mode: "off" | "one" | "all") => void;

  next: () => void;
  previous: () => void;
};

const usePlayerStore = create<PlayerStore>()((set) => ({
  currentQueueItem: null,
  queue: [],
  playbackQueue: [],
  isPlaying: false,
  isShuffle: false,
  muted: false,
  repeatedMode: "all",

  setCurrentQueueItem: (item) => set({ currentQueueItem: item }),

  playSong: (song, songs) => {
    set((state) => {
      // build queue items with unique ids
      const queue = songs.map((s) => ({
        id: crypto.randomUUID(),
        songId: s.id,
      }));

      // build playback queue based on shuffle mode
      const playbackQueue = state.isShuffle ? shuffleQueue(queue) : queue;

      // find the queue item for the selected song
      const currentItem = queue.find((item) => item.songId === song.id);

      return {
        queue,
        playbackQueue,
        currentQueueItem: currentItem || null,
        isPlaying: true,
      };
    });
  },

  // add new song to both UI queue and playback queue
  addToQueue: (song) =>
    set((state) => {
      const newItem: QueueItem = { id: crypto.randomUUID(), songId: song.id };
      return {
        queue: [...state.queue, newItem],
        playbackQueue: [...state.playbackQueue, newItem],
      };
    }),
  // remove song from both UI queue and playback queue
  // if the removed song is the current song, set currentQueueItem to null
  removeFromQueue: (queueItemId) =>
    set((state) => {
      const queue = state.queue.filter((item) => item.id !== queueItemId);

      const playbackQueue = state.playbackQueue.filter(
        (item) => item.id !== queueItemId,
      );

      const currentQueueItem =
        state.currentQueueItem?.id === queueItemId
          ? null
          : state.currentQueueItem;

      return {
        queue,
        playbackQueue,
        currentQueueItem,
        isPlaying: currentQueueItem ? state.isPlaying : false,
      };
    }),

  //setPlaybackQueue: (queue) => set({ playbackQueue: queue }),

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
        (item) => item.id === state.currentQueueItem?.id,
      );
      const nextIndex = (currentIndex + 1) % state.playbackQueue.length;
      return { currentQueueItem: state.playbackQueue[nextIndex] };
    }),
  previous: () =>
    set((state) => {
      const currentIndex = state.playbackQueue.findIndex(
        (item) => item.id === state.currentQueueItem?.id,
      );
      const previousIndex =
        (currentIndex - 1 + state.playbackQueue.length) %
        state.playbackQueue.length;
      return { currentQueueItem: state.playbackQueue[previousIndex] };
    }),
}));

export default usePlayerStore;

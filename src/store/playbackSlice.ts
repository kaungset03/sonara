import { StateCreator } from "zustand";
import { type AppStoreState } from "./app-store";
import { shuffleQueue } from "@/lib/helpers";

export interface PlaybackState {
  currentQueueItem: QueueItem | null;
  // UI queue not affected by shuffle mode
  queue: QueueItem[];
  // actual playback queue (no shuffle: same as queue, shuffle: shuffled version of queue)
  playbackQueue: QueueItem[];

  // playback state
  isPlaying: boolean;
  isShuffle: boolean;
  muted: boolean;
  repeatMode: "off" | "one" | "all";

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
  toggleRepeatMode: () => void;

  next: () => void;
  previous: () => void;

  isPlaybackInitialized: boolean;

  initPlaybackFromSettings: () => void;
}

const createPlaybackSlice: StateCreator<
  AppStoreState,
  [],
  [],
  PlaybackState
> = (set, get) => ({
  currentQueueItem: null,
  queue: [],
  playbackQueue: [],
  isPlaying: false,
  isShuffle: false,
  muted: false,
  repeatMode: "all",

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
  toggleRepeatMode: () =>
    set((state) => {
      const repeatModes: Array<"off" | "one" | "all"> = ["off", "one", "all"];
      const currentIndex = repeatModes.indexOf(state.repeatMode);
      const nextIndex = (currentIndex + 1) % repeatModes.length;
      return { repeatMode: repeatModes[nextIndex] };
    }),

  next: () =>
    set((state) => {
      // repeated mode one is handled in the audio component

      const currentIndex = state.playbackQueue.findIndex(
        (item) => item.id === state.currentQueueItem?.id,
      );
      const nextIndex = (currentIndex + 1) % state.playbackQueue.length;

      // reach the end of the queue and repeat mode is off, stop playback
      if (state.repeatMode === "off" && nextIndex === 0) {
        return { currentQueueItem: null, isPlaying: false };
      }

      // otherwise, move to the next song
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

  isPlaybackInitialized: false,

  initPlaybackFromSettings: () => {
    if (get().isPlaybackInitialized) return;

    // Grab the freshly loaded persisted value
    const isShuffle = get().isShuffleConfig;
    const repeatMode = get().repeatModeConfig;

    // Update the playback state with the persisted settings
    set({
      isShuffle: isShuffle,
      repeatMode: repeatMode,
      isPlaybackInitialized: true,
    });
  },
});

export default createPlaybackSlice;

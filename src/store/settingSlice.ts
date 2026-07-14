import { type StateCreator } from "zustand";
import { type AppStoreState } from "./app-store";

export interface SettingState {
  isShuffleConfig: boolean;
  repeatModeConfig: "off" | "one" | "all";
  setShuffleConfig: (isShuffle: boolean) => void;
  setRepeatModeConfig: (mode: "off" | "one" | "all") => void;
  albumSortValue: SortValue;
  artistSortValue: SortValue;
  setAlbumSortValue: (value: SortValue) => void;
  setArtistSortValue: (value: SortValue) => void;
}

const createSettingSlice: StateCreator<AppStoreState, [], [], SettingState> = (
  set,
) => ({
  isShuffleConfig: false,
  repeatModeConfig: "all",
  setShuffleConfig: (isShuffle) => set({ isShuffleConfig: isShuffle }),
  setRepeatModeConfig: (mode) => set({ repeatModeConfig: mode }),
  albumSortValue: "created_at-desc",
  artistSortValue: "created_at-desc",
  setAlbumSortValue: (value) => set({ albumSortValue: value }),
  setArtistSortValue: (value) => set({ artistSortValue: value }),
});

export default createSettingSlice;

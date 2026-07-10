import { type StateCreator } from "zustand";
import { type AppStoreState } from "./app-store";

export interface SettingState {
  isShuffleConfig: boolean;
  repeatModeConfig: "off" | "one" | "all";
  setShuffleConfig: (isShuffle: boolean) => void;
  setRepeatModeConfig: (mode: "off" | "one" | "all") => void;
}

const createSettingSlice: StateCreator<AppStoreState, [], [], SettingState> = (
  set,
) => ({
  isShuffleConfig: false,
  repeatModeConfig: "all",
  setShuffleConfig: (isShuffle) => set({ isShuffleConfig: isShuffle }),
  setRepeatModeConfig: (mode) => set({ repeatModeConfig: mode }),
});

export default createSettingSlice;

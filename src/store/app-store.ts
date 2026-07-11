import { create } from "zustand";
import { persist } from "zustand/middleware";
import createPlaybackSlice, { type PlaybackState } from "./playbackSlice";
import createSettingSlice, { type SettingState } from "./settingSlice";

export type AppStoreState = SettingState & PlaybackState;

const useAppStore = create<AppStoreState>()(
  persist(
    (...a) => ({
      ...createPlaybackSlice(...a),
      ...createSettingSlice(...a),
    }),
    {
      name: "app-store",
      // only persist settings, not playback state
      partialize: (state) => ({
        isShuffleConfig: state.isShuffleConfig,
        repeatModeConfig: state.repeatModeConfig,
      }),
    },
  ),
);

const unsubHydrate = useAppStore.persist.onFinishHydration(() => {
  useAppStore.getState().initPlaybackFromSettings();
  unsubHydrate(); 
});

if (useAppStore.persist.hasHydrated()) {
  useAppStore.getState().initPlaybackFromSettings();
}

export default useAppStore;

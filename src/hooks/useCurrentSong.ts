import usePlayerStore from "@/store/store";

const useCurrentSong = () => {
  const currentQueueItemId = usePlayerStore(
    (state) => state.currentQueueItemId,
  );
  const playbackQueue = usePlayerStore((state) => state.playbackQueue);

  const currentSong = playbackQueue.find(
    (item) => item.id === currentQueueItemId,
  )?.song;

  return currentSong;
};
export default useCurrentSong;

import usePlayerStore from "@/store/store";
import useGetAllSongsQuery from "@/features/songs/api/useGetAllSongsQuery";

const useCurrentSong = () => {
  const currentQueueItem = usePlayerStore((state) => state.currentQueueItem);
  const { data: allSongs } = useGetAllSongsQuery();
  const currentSong =
    allSongs?.find((song) => song.id === currentQueueItem?.songId) || null;
  return currentSong;
};
export default useCurrentSong;

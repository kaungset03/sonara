import useGetAllSongsQuery from "@/features/songs/api/useGetAllSongsQuery";
import useAppStore from "@/store/app-store";

const useCurrentSong = () => {
  const currentQueueItem = useAppStore((state) => state.currentQueueItem);
  const { data: allSongs } = useGetAllSongsQuery();
  const currentSong =
    allSongs?.find((song) => song.id === currentQueueItem?.songId) || null;
  return currentSong;
};
export default useCurrentSong;

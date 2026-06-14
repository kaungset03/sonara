import useGetAllSongsQuery from "@/features/songs/useGetAllSongsQuery";
import usePlayerStore from "@/store/store";

const useCurrentSong = () => {
  const { data } = useGetAllSongsQuery();

  const currentSongId = usePlayerStore((state) => state.currentSongId);
  return data?.find((song) => song.id === currentSongId) || null;
};
export default useCurrentSong;

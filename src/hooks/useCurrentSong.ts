import useAppStore from "@/store/app-store";
//import useGetSongByIdQuery from "@/features/songs/api/useGetSongByIdQuery";
import useGetAllSongsQuery from "@/features/songs/api/useGetAllSongsQuery";

// const useCurrentSong = () => {
//   const currentQueueItem = useAppStore((state) => state.currentQueueItem);
//   const { data } = useGetSongByIdQuery({
//     songId: currentQueueItem?.songId ?? -1,
//   });
//   return data;
// };
// export default useCurrentSong;

const useCurrentSong = () => {
  const currentQueueItem = useAppStore((state) => state.currentQueueItem);
  const { data } = useGetAllSongsQuery();
  const currentSong = data?.find(
    (song) => song.id === currentQueueItem?.songId,
  );
  return currentSong;
};

export default useCurrentSong;

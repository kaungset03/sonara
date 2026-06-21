import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

type UseGetSongByIdQueryParams = {
  songId: number;
};

const useGetSongByIdQuery = ({ songId }: UseGetSongByIdQueryParams) => {
  return useQuery({
    queryKey: ["songs", songId],
    queryFn: async () => {
      const res = await invoke<Song>("get_song_by_id", { id: songId });
      return res;
    },
  });
};
export default useGetSongByIdQuery;

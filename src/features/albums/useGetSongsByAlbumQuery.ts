import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

const useGetSongsByAlbumQuery = (album: string) => {
  const { data } = useQuery({
    queryKey: ["songs_by_album", album],
    queryFn: async () => {
      const res = await invoke("get_songs_by_album", { album });
      return res as Song[];
    },
  });

  return { data };
};
export default useGetSongsByAlbumQuery;

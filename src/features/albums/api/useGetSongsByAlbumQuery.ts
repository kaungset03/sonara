import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

type Response = {
  album: Album;
  songs: Song[];
};

const useGetSongsByAlbumQuery = (albumId: number) => {
  const { data, isFetching } = useQuery({
    queryKey: ["songs", "album", albumId],
    queryFn: async () => {
      const res = await invoke<Response>("get_album_details", { albumId });
      return res;
    },
  });

  return { data, isFetching };
};
export default useGetSongsByAlbumQuery;

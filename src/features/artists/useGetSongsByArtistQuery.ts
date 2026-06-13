import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

const useGetSongsByArtistQuery = (artist: string) => {
  const { data } = useQuery({
    queryKey: ["songs", "artist", artist],
    queryFn: async () => {
      const res = await invoke("get_songs_by_artist", { artist });
      return res as Song[];
    },
  });

  return { data };
};
export default useGetSongsByArtistQuery;

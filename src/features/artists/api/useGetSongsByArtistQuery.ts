import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

type Response = {
  artist: Artist;
  songs: Song[];
};

const useGetSongsByArtistQuery = (artistId: number) => {
  const { data, isFetching } = useQuery({
    queryKey: ["songs", "artist", artistId],
    queryFn: async () => {
      const res = await invoke<Response>("get_artist_details", { artistId });
      return res;
    },
  });

  return { data, isFetching };
};
export default useGetSongsByArtistQuery;

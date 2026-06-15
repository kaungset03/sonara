import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

const useGetAllPlaylistsQuery = () => {
  return useQuery({
    queryKey: ["playlists"],
    queryFn: async () => {
      const playlists = await invoke<Playlist[]>("get_all_playlists");
      return playlists;
    },
  });
};
export default useGetAllPlaylistsQuery;

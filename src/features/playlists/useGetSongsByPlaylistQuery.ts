import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
const useGetSongsByPlaylistQuery = (playlistId: number) => {
  return useQuery({
    queryKey: ["songs", "playlist", playlistId],
    queryFn: async () => {
      const songs = await invoke<Song[]>("get_songs_by_playlist", {
        playlistId,
      });
      return songs;
    },
  });
};
export default useGetSongsByPlaylistQuery;

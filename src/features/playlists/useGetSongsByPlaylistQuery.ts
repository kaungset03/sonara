import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

type PlaylistDetails = {
  playlist: Playlist;
  songs: Song[];
};

const useGetSongsByPlaylistQuery = (playlistId: number) => {
  return useQuery({
    queryKey: ["songs", "playlist", playlistId],
    queryFn: async () => {
      const songs = await invoke<PlaylistDetails>("get_songs_by_playlist", {
        playlistId,
      });
      return songs;
    },
  });
};
export default useGetSongsByPlaylistQuery;

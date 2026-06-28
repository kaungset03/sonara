import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

type GetSongLyricsProps = {
  songId: number;
};

const useGetSongLyricsQuery = ({ songId }: GetSongLyricsProps) => {
  const query = useQuery({
    queryKey: ["lyrics", songId],
    queryFn: async () => {
      const res = await invoke<string>("get_song_lyrics", { songId });
      return res;
    },
  });
  return query;
};
export default useGetSongLyricsQuery;

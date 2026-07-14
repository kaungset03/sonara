import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

const useGetFavoriteSongsQuery = () => {
  const query = useQuery({
    queryKey: ["songs", "favorites"],
    queryFn: async () => {
      const res = await invoke("get_favorite_songs");
      return res as Song[];
    },
  });

  return query;
};
export default useGetFavoriteSongsQuery;

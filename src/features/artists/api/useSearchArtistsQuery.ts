import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

const useSearchArtistsQuery = (search: string) => {
  const query = useQuery({
    queryKey: ["searchArtists", search],
    queryFn: async () => {
      const res = await invoke<Array<{ id: number; name: string }>>(
        "search_artists",
        { search },
      );
      return res;
    },
    enabled: search.trim().length > 0,
  });
  return query;
};
export default useSearchArtistsQuery;

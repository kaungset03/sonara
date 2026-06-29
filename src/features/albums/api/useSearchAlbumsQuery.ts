import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

const useSearchAlbumsQuery = (search: string) => {
  const query = useQuery({
    queryKey: ["searchAlbums", search],
    queryFn: async () => {
      const res = await invoke<Array<{ id: number; name: string }>>(
        "search_albums",
        { search },
      );
      return res;
    },
    enabled: search.trim().length > 0,
  });
  return query;
};
export default useSearchAlbumsQuery;

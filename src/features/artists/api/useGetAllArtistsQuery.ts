import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

const useGetAllArtistsQuery = () => {
  return useQuery({
    queryKey: ["artists"],
    queryFn: async () => {
      const res = await invoke<Artist[]>("get_all_artists");
      return res;
      // later, there will be more info like artist profile pic, etc.
    },
  });
};
export default useGetAllArtistsQuery;

import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

const useGetAllArtistsQuery = () => {
  const { data } = useQuery({
    queryKey: ["artists"],
    queryFn: async () => {
      const res = await invoke("get_all_artists");
      return res as Artist[];
      // later, there will be more info like artist profile pic, etc.
    },
  });

  return { data };
};
export default useGetAllArtistsQuery;

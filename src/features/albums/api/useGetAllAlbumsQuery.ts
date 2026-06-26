import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

const useGetAllAlbumsQuery = () => {
  const { data } = useQuery({
    queryKey: ["albums"],
    queryFn: async () => {
      const res = await invoke<Album[]>("get_all_albums");
      return res;
      // later, there will be more info like album art, etc.
    },
  });

  return { data };
};
export default useGetAllAlbumsQuery;

import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

const useGetAllSongsQuery = () => {
  const query = useQuery({
    queryKey: ["songs"],
    queryFn: async () => {
      const res = await invoke<Song[]>("get_all_songs");
      return res;
    },
  });
  return query;
};
export default useGetAllSongsQuery;

import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

const useGetAllSongsQuery = () => {
  const { data } = useQuery({
    queryKey: ["songs"],
    queryFn: async () => {
      const res = await invoke("get_all_songs");
      return res as Song[];
    },
  });

  return { data };
};
export default useGetAllSongsQuery;

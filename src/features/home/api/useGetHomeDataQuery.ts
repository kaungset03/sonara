import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

const useGetHomeDataQuery = () => {
  const query = useQuery({
    queryKey: ["homeData"],
    queryFn: async () => {
      const res = await invoke<HomeData>("get_home_data");
      return res;
    },
  });
  return query;
};
export default useGetHomeDataQuery;

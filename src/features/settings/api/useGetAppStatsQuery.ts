// Songs Count
// Albums Count
// Artists Count
// Folders Count
// App Version

import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

const useGetAppStatsQuery = () => {
  const { data } = useQuery({
    queryKey: ["appStats"],
    queryFn: async () => {
      const res = await invoke<AppStats>("get_app_stats");
      return res;
    },
  });
  return { data };
};
export default useGetAppStatsQuery;

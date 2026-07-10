import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

const useGetAppConfigQuery = () => {
  const { data } = useQuery({
    queryKey: ["appConfig"],
    queryFn: async () => {
      const res = await invoke<{ auto_download_enabled: boolean }>(
        "get_app_config",
      );
      return res;
    },
  });
  return data?.auto_download_enabled;
};
export default useGetAppConfigQuery;

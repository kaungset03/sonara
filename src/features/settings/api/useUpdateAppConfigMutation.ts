import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

const useUpdateAppConfigMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (autoDownloadEnabled: boolean) => {
      await invoke("update_app_config", {
        autoDownloadEnabled,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appConfig"] });
    },
  });
  return mutation;
};
export default useUpdateAppConfigMutation;

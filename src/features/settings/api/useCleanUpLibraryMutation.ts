import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

const useCleanUpLibraryMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await invoke<string>("cleanup_library");
      return res;
    },
    onSuccess: (m) => {
      toast.success(m);
    },
    onError: () => {
      toast.error("Failed to clean up library");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["albums", "artists", "appStats"],
        exact: false,
      });
    },
  });
  return mutation;
};
export default useCleanUpLibraryMutation;

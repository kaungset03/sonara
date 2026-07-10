import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

const useSyncLibraryFoldersMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await invoke<string>("sync_library_folders");
      return res;
    },
    onSuccess: (msg) => {
      toast.success(msg);
    },
    onError: (error) => {
      toast.error("Failed to sync library folders.");
      console.error("Sync error:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["importedFolders", "appStats"],
        exact: false,
      });
    },
  });

  return mutation;
};
export default useSyncLibraryFoldersMutation;

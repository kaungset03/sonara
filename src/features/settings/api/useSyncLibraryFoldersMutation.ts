import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

const useSyncLibraryFoldersMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await invoke<ImportResult>("sync_library_folders");
      return res;
    },
    onSuccess: (r) => {
      toast.success(`Added ${r.added} files,  Removed ${r.removed} files.`);
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      queryClient.refetchQueries({ queryKey: ["importedFolders"] });
      queryClient.refetchQueries({ queryKey: ["homeData"] });
    },
    onError: (error) => {
      toast.error("Failed to sync library folders.");
      console.error("Sync error:", error);
    },
  });

  return mutation;
};
export default useSyncLibraryFoldersMutation;

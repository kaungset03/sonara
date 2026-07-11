import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

const useImportFilesMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (path: string) => {
      const result = await invoke<string>("add_library_folder", {
        path,
      });
      return result;
    },
    onSuccess: (msg) => {
      queryClient.refetchQueries({ queryKey: ["importedFolders"] });
      queryClient.refetchQueries({ queryKey: ["homeData"] });

      toast.success(msg);
    },
    onError: (error) => {
      toast.error("Failed to import files.");
      console.error("Import error:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["songs", "albums", "artists"],
        exact: false,
      });
    },
  });
  return mutation;
};
export default useImportFilesMutation;

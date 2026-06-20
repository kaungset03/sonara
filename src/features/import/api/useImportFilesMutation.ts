import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

const useImportFilesMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (path: string) => {
      const result = await invoke<ImportResult>("add_library_folder", {
        path,
      });
      return result;
    },
    onSuccess: (r) => {
      queryClient.invalidateQueries({ queryKey: ["homeData", "songs"] });
      toast.success(
        "Imported: " + r.imported + " files, skipped: " + r.skipped,
      );
    },
    onError: (error) => {
      toast.error("Failed to import files.");
      console.error("Import error:", error);
    },
  });
  return mutation;
};
export default useImportFilesMutation;

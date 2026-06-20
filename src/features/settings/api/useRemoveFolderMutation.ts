// remove library folder from the list of imported folders
// revalidate the list of imported folders after removing the folder

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

const useRemoveFolderMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id: number) => {
      await invoke("remove_library_folder", { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["importedFolders"] });
    },
  });
  return mutation;
};
export default useRemoveFolderMutation;

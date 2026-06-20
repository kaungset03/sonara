import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

const useGetImportedFoldersQuery = () => {
  const { data } = useQuery({
    queryKey: ["importedFolders"],
    queryFn: async () => {
      const response = await invoke<ImportedFolder[]>("get_imported_folders");
      return response;
    },
  });
  return { data };
};
export default useGetImportedFoldersQuery;

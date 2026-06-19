import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

type SearchLibraryQueryProps = {
  search: string;
};

const useSearchLibraryQuery = ({ search }: SearchLibraryQueryProps) => {
  const { data } = useQuery({
    queryKey: ["searchLibrary", search],
    queryFn: async () => {
      const res = await invoke<SearchResults>("search_library", { search });
      return res;
    },
    enabled: search.trim() !== "",
  });

  return { data };
};
export default useSearchLibraryQuery;

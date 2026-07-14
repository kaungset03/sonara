import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

type GetAllArtistsQueryProps = {
  value: SortValue; 
};

const useGetAllArtistsQuery = ({ value }: GetAllArtistsQueryProps) => {
  const [sortCol, orderDirection] = value.split("-") as [SortField, SortOrder];
  return useQuery({
    queryKey: ["artists", value],
    queryFn: async () => {
      const res = await invoke<Artist[]>("get_all_artists", {
        sortCol,
        orderDirection,
      });
      return res;
    },
  });
};
export default useGetAllArtistsQuery;

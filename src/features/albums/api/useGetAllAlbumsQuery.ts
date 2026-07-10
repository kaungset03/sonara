import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

type GetAllAlbumsQueryProps = {
  value: SortValue; // the value of the selected sort option, e.g., "name-asc", "created_at-desc"
};

const useGetAllAlbumsQuery = ({ value }: GetAllAlbumsQueryProps) => {
  const [sortCol, orderDirection] = value.split("-") as [SortField, SortOrder];
  const { data } = useQuery({
    queryKey: ["albums", value],
    queryFn: async () => {
      const res = await invoke<Album[]>("get_all_albums", {
        sortCol,
        orderDirection,
      });
      return res;
    },
  });

  return { data };
};
export default useGetAllAlbumsQuery;

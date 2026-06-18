import { useQueryClient } from "@tanstack/react-query";

const useSongById = (id: number) => {
  const queryClient = useQueryClient();

  return queryClient.getQueryData<Song[]>(["songs"])?.find((s) => s.id === id);
};

export default useSongById;

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { updateSongInCache } from "@/lib/helpers";

type ToggleFavoriteInput = {
  songId: number;
  isFavorite: boolean;
};

type ToggleFavoriteContext = {
  previousSongs: Song[] | undefined;
};

const useToggleFavoriteMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    boolean,
    Error,
    ToggleFavoriteInput,
    ToggleFavoriteContext
  >({
    mutationFn: async ({ songId, isFavorite }) => {
      await invoke("set_favorite_song", {
        songId,
        isFavorite,
      });
      return isFavorite;
    },
    onMutate: async ({ songId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ["songs"] });

      const previousSongs = queryClient.getQueryData<Song[]>(["songs"]);

      updateSongInCache(queryClient, songId, (song) => ({
        ...song,
        isFavorite,
      }));

      return { previousSongs };
    },
    onSuccess: () => {
      toast.success("Favorite status updated");
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
    onError: (_err, _vars, context) => {
      if (context?.previousSongs) {
        queryClient.setQueryData(["songs"], context.previousSongs);
      }
    },
  });

  return mutation;
};

export default useToggleFavoriteMutation;

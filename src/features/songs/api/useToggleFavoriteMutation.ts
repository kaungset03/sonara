import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
//import { updateSongInCache } from "@/lib/helpers";

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
    void,
    Error,
    ToggleFavoriteInput,
    ToggleFavoriteContext
  >({
    mutationFn: async ({ songId, isFavorite }) => {
      await invoke("set_favorite_song", {
        songId,
        isFavorite,
      });
    },
    onSuccess: () => {
      toast.success("Favorite status updated");
      queryClient.invalidateQueries({ queryKey: ["songs"], exact: false });
    },
    onError: (err) => {
      toast.error("Failed to update favorite status: ");
      console.error(err);
    },
  });

  return mutation;
};

export default useToggleFavoriteMutation;

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
//import { updateSongInCache } from "@/lib/helpers";

type ToggleFavoriteInput = {
  songId: number;
  isFavorite: boolean;
};

const useToggleFavoriteMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<string, Error, ToggleFavoriteInput>({
    mutationFn: async ({ songId, isFavorite }) => {
      const res = await invoke<string>("set_favorite_song", {
        songId,
        isFavorite,
      });
      return res;
    },
    onSuccess: (message) => {
      toast.success(message);
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

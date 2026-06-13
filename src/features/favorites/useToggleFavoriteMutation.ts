import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

type ToggleFavoriteInput = {
  songId: number;
  isFavorite: boolean;
};

const useToggleFavoriteMutation = () => {
  const mutation = useMutation<boolean, Error, ToggleFavoriteInput>({
    mutationFn: ({ songId, isFavorite }) => {
      const toggleFavorite = async () => {
        try {
          await invoke("set_favorite_song", {
            song_id: songId,
            is_favorite: isFavorite,
          });
          return true;
        } catch (error) {
          throw new Error("Failed to toggle favorite");
        }
      };

      return toggleFavorite();
    },
    onSuccess: () => {
      console.log("Favorite toggled successfully");
    },
    onError: (error) => {
      console.error("Error toggling favorite:", error);
    },
  });

  return mutation;
};

export default useToggleFavoriteMutation;

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

type UpdateArtistImagePayload = {
  artistId: number;
  imagePath: string;
};

const useUpdateArtistImageMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ artistId, imagePath }: UpdateArtistImagePayload) => {
      await invoke("update_artist_image", { artistId, imagePath });
    },
    onSuccess: (_, { artistId }) => {
      toast.success("Artist image updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["songs", "artist", artistId],
      });
    },
    onError: (error) => {
      console.error("Error updating artist image:", error);
    },
  });

  return mutation;
};
export default useUpdateArtistImageMutation;

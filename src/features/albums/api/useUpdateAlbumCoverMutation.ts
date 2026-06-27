import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

type UpdateAlbumCoverPayload = {
  albumId: number;
  imagePath: string;
};

const useUpdateAlbumCoverMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ albumId, imagePath }: UpdateAlbumCoverPayload) => {
      await invoke("update_album_cover", { albumId, imagePath });
    },
    onSuccess: (_, { albumId }) => {
      toast.success("Album cover updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["songs", "album", albumId] });
    },
    onError: (error) => {
      console.error("Error updating album cover:", error);
    },
  });
  return mutation;
};
export default useUpdateAlbumCoverMutation;

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
    onSuccess: () => {
      toast.success("Album cover updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating album cover:", error);
    },
    onSettled: (_, __, { albumId }) => {
      queryClient.invalidateQueries({ queryKey: ["songs", "album", albumId] });
    },
  });
  return mutation;
};
export default useUpdateAlbumCoverMutation;

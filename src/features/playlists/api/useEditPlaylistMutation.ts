import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

type EditPlaylistProps = {
  closeDialog: () => void;
};

const useEditPlaylistMutation = ({ closeDialog }: EditPlaylistProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      playlistId,
      newName,
    }: {
      playlistId: number;
      newName: string;
    }) => {
      await invoke("edit_playlist", { playlistId, newName });
    },
    onSuccess: (_, variables) => {
      toast.success("Playlist updated");
      closeDialog();
      queryClient.invalidateQueries({
        queryKey: ["songs", "playlist", variables.playlistId],
      });
    },
    onError: (err) => {
      toast.error(`Failed to update playlist: ${err.message}`);
    },
  });
  return mutation;
};
export default useEditPlaylistMutation;

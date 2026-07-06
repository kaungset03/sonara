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
    onSuccess: (_, { playlistId }) => {
      toast.success("Playlist updated");
      queryClient.invalidateQueries({
        queryKey: ["songs", "playlist", playlistId],
        exact: false,
      });
    },
    onError: (err) => {
      toast.error(`Failed to update playlist: ${err.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["playlists"],
        exact: true,
      });
      closeDialog();
    },
  });
  return mutation;
};
export default useEditPlaylistMutation;

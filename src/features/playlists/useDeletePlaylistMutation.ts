import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

const useDeletePlaylistMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (playlistId: string) => {
      await invoke("delete_playlist", { playlistId });
    },
    onSuccess: () => {
      toast.success("Playlist deleted");
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
    onError: (err) => {
      toast.error(`Failed to delete playlist: ${err.message}`);
    },
  });

  return mutation;
};
export default useDeletePlaylistMutation;

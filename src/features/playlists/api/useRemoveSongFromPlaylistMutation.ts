import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

const useRemoveSongFromPlaylistMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      songIds,
      playlistId,
    }: {
      songIds: number[];
      playlistId: number;
    }) => {
      await invoke("remove_songs_from_playlist", { songIds, playlistId });
    },
    onSuccess: (_, variables) => {
      toast.success("Song removed from playlist");
      queryClient.invalidateQueries({
        queryKey: ["songs", "playlist", variables.playlistId],
      });
    },
    onError: (err) => {
      toast.error(`Failed to remove song from playlist: ${err.message}`);
    },
  });
  return mutation;
};
export default useRemoveSongFromPlaylistMutation;

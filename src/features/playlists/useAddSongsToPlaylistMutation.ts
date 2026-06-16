import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

type AddSongsToPlaylistProps = {
  closeDialog: () => void;
};

const useAddSongsToPlaylistMutation = ({
  closeDialog,
}: AddSongsToPlaylistProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      songIds,
      playlistId,
    }: {
      songIds: number[];
      playlistId: number;
    }) => {
      await invoke("add_songs_to_playlist", { playlistId, songIds });
    },
    onSuccess: (_, variables) => {
      toast.success("Songs added to playlist");
      closeDialog();
      queryClient.invalidateQueries({
        queryKey: ["songs", "playlist", variables.playlistId],
      });
    },
    onError: (err) => {
      toast.error(`Failed to add songs to playlist: ${err.message}`);
    },
  });
  return mutation;
};
export default useAddSongsToPlaylistMutation;

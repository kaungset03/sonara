import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

type AddSongToPlaylistProps = {
  closeDialog: () => void;
};

const useAddSongToPlaylistMutation = ({
  closeDialog,
}: AddSongToPlaylistProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      songIds,
      playlistId,
    }: {
      songIds: number[];
      playlistId: number;
    }) => {
      await invoke("add_song_to_playlist", { songIds, playlistId });
    },
    onSuccess: (_, variables) => {
      toast.success("Song added to playlist");
      closeDialog();
      queryClient.invalidateQueries({
        queryKey: ["songs", "playlist", variables.playlistId],
      });
    },
    onError: (err) => {
      toast.error(`Failed to add song to playlist: ${err.message}`);
    },
  });
  return mutation;
};
export default useAddSongToPlaylistMutation;

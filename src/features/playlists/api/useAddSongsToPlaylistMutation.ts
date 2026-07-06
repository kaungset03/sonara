import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

type AddSongsToPlaylistProps = {
  closeDialog: () => void;
};

type AddedSongsResult = {
  added: number;
  skipped: number;
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
      const result = await invoke<AddedSongsResult>("add_songs_to_playlist", {
        playlistId,
        songIds,
      });
      return result;
    },
    onSuccess: (result, variables) => {
      if (result.added > 0) {
        toast.success(
          `Added ${result.added} songs (${
            result.skipped
          } already in playlist)!`,
        );
      } else {
        toast.warning("Selected songs are already in the playlist.");
      }
      queryClient.invalidateQueries({
        queryKey: ["songs", "playlist", variables.playlistId],
        exact: false,
      });
    },
    onError: (err) => {
      toast.error(`Failed to add songs to playlist: ${err.message}`);
    },
    onSettled: () => {
      closeDialog();
    },
  });
  return mutation;
};
export default useAddSongsToPlaylistMutation;

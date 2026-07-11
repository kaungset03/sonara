import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

type UpdateLyricsContentInput = {
  songId: number;
  lyricsContent: string;
};

type UpdateLyricsContentProps = {
  closeDialog: () => void;
};

const useUpdateSongLyricsContentMutation = ({
  closeDialog,
}: UpdateLyricsContentProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ songId, lyricsContent }: UpdateLyricsContentInput) => {
      await invoke("update_song_lyrics", { songId, lyricsContent });
    },
    onSuccess: () => {
      toast.success("Successfully updated lyrics.");
      closeDialog();
    },
    onError: (err) => {
      toast.error("Sorry, failed to update lyrics.");
      console.error(err);
    },
    onSettled: (_, __, { songId }) => {
      queryClient.invalidateQueries({
        queryKey: ["lyrics", songId],
        exact: true,
      });
    },
  });
  return mutation;
};
export default useUpdateSongLyricsContentMutation;

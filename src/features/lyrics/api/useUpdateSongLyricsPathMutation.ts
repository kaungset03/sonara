import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

type UpdateLyricsPathInput = {
  songId: number;
  lyricsPath: string;
};

const useUpdateSongLyricsPathMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ songId, lyricsPath }: UpdateLyricsPathInput) => {
      await invoke("update_song_lyrics", { songId, lyricsPath });
    },
    onMutate: async ({ songId, lyricsPath }) => {
      queryClient.setQueryData(["lyrics", songId], lyricsPath);
    },
    onSuccess: (_, { songId }) => {
      toast.success("Successfully updated lyrics.");
      queryClient.invalidateQueries({
        queryKey: ["lyrics", songId],
        refetchType: "active",
      });
    },
    onError: (err) => {
      // Fall back to the previous lyrics path if the mutation fails
      queryClient.invalidateQueries({
        queryKey: ["lyrics"],
        refetchType: "active",
      });
      toast.error("Sorry, failed to update lyrics.");
      console.error(err);
    },
  });
  return mutation;
};
export default useUpdateSongLyricsPathMutation;

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
    onSuccess: () => {
      toast.success("Successfully updated lyrics.");
      queryClient.invalidateQueries({ queryKey: ["songs"], exact: false });
    },
    onError: (err) => {
      toast.error("Sorry, failed to update lyrics.");
      console.error(err);
    },
  });
  return mutation;
};
export default useUpdateSongLyricsPathMutation;

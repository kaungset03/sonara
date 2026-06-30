import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

type EditSongInfoProps = {
  closeDialog: () => void;
};

type EditSongInfoVariables = {
  id: number;
  title: string;
  albumName: string;
  artistName: string;
  albumArtistName: string;
  trackNumber: number | null;
};

const useEditSongInfoMutation = ({ closeDialog }: EditSongInfoProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (variables: EditSongInfoVariables) => {
      await invoke("update_song_metadata", variables);
    },
    onSuccess: () => {
      toast.success("Song info updated");
      queryClient.invalidateQueries({
        queryKey: ["songs"],
        exact: false,
      });
    },
    onError: (err) => {
      toast.error(`Failed to update song info: ${err.message}`);
    },
    onSettled: () => {
      closeDialog();
    },
  });
  return mutation;
};
export default useEditSongInfoMutation;

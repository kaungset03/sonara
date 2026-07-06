import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

type CreatePlaylistProps = {
  closeDialog: () => void;
};

const useCreatePlaylistMutation = ({ closeDialog }: CreatePlaylistProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (name: string) => {
      return await invoke<number>("create_playlist", { name });
    },
    onSuccess: (playlistId: number) => {
      toast.success("New playlist created");
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      navigate({ to: "/playlists/$id", params: { id: playlistId.toString() } });
    },
    onError: (err) => {
      toast.error(`Failed to create playlist: ${err.message}`);
    },
    onSettled: () => {
      closeDialog();
    },
  });

  return mutation;
};
export default useCreatePlaylistMutation;

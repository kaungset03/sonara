import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

const useDeletePlaylistMutation = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (playlistId: number) => {
      await invoke("delete_playlist", { playlistId });
    },
    onSuccess: (_, playlistId) => {
      toast.success("Playlist deleted");

      if (pathname === `/playlists/${playlistId}`) {
        navigate({ to: "/songs" });
      }
    },
    onError: (err) => {
      toast.error(`Failed to delete playlist: ${err.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });

  return mutation;
};
export default useDeletePlaylistMutation;

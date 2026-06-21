import { open } from "@tauri-apps/plugin-dialog";
import { Button } from "@/components/ui/button";
import useUpdateSongLyricsPathMutation from "@/features/songs/api/useUpdateSongLyricsPathMutation";

type UpdateSongLyricsButtonProps = {
  songId: number;
};

const UpdateSongLyricsButton = ({ songId }: UpdateSongLyricsButtonProps) => {
  const mutation = useUpdateSongLyricsPathMutation();

  const handleUpdateLyrics = async () => {
    const path = await open({
      multiple: false,
      directory: false,
      filters: [
        {
          name: "Lyrics Files (*.lrc)",
          extensions: ["lrc"],
        },
      ],
    });
    if (path) {
      mutation.mutate({ songId, lyricsPath: path });
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleUpdateLyrics}
      size="sm"
      className="text-xs"
    >
      Update Lyrics
    </Button>
  );
};
export default UpdateSongLyricsButton;

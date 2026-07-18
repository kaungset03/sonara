import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useUpdateSongLyricsPathMutation from "@/features/lyrics/api/useUpdateSongLyricsPathMutation";
import { openUrl } from "@tauri-apps/plugin-opener";
import { type SubmitEvent, useState } from "react";

type UpdateSongLyricsProps = {
  song_id: number;
  description: string;
  initialContent: string;
};

const UpdateSongLyrics = ({
  song_id,
  description,
  initialContent,
}: UpdateSongLyricsProps) => {
  const [open, setOpen] = useState(false);
  const [lyricsContent, setLyricsContent] = useState<string>(initialContent);

  // useEffect(() => {
  //   setLyricsContent(initialContent);
  // }, [initialContent]);

  const handleDialog = () => {
    setLyricsContent("");
    setOpen(false);
  };

  const mutation = useUpdateSongLyricsPathMutation({
    closeDialog: handleDialog,
  });

  const handleUpdateLyrics = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ songId: song_id, lyricsContent });
  };

  const goToLRCILIB = async () => {
    await openUrl("https://lrclib.net");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs border border-muted-foreground/30"
        >
          Update Lyrics
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-lg" showCloseButton={false}>
        <DialogHeader className="space-y-1">
          <DialogTitle>{description}</DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span>Lyrics must be in LRC synced format.</span>
            <span
              onClick={goToLRCILIB}
              role="button"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Search lyrics on LRCLIB ↗
            </span>
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleUpdateLyrics}
          className="max-h-[60vh] min-w-full"
          id={`update-lyrics-form-${song_id}`}
        >
          <textarea
            id={song_id.toString()}
            value={lyricsContent}
            onChange={(e) => setLyricsContent(e.target.value)}
            className="w-full min-h-[55vh] p-2 rounded-xl border border-muted-foreground/30 focus:border-muted-foreground outline-none scrollbar-none tracking-wide"
            placeholder="Enter the lyrics for this song..."
          />
        </form>

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button form={`update-lyrics-form-${song_id}`} type="submit">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default UpdateSongLyrics;

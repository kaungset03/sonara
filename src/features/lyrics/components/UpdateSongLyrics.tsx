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
import { type SubmitEvent, useEffect, useState } from "react";

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

  useEffect(() => {
    setLyricsContent(initialContent);
  }, [initialContent]);

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
      <DialogContent className="w-full max-w-xl" showCloseButton={false}>
        <DialogHeader className="space-y-1">
          <DialogTitle>{description}</DialogTitle>
          <DialogDescription>
            Update the lyrics for this song in lrc synced format.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleUpdateLyrics}
          className="max-h-[50vh]"
          id={`update-lyrics-form-${song_id}`}
        >
          <textarea
            value={lyricsContent}
            onChange={(e) => setLyricsContent(e.target.value)}
            className="w-full min-h-[40vh] p-2 rounded-xl border border-muted-foreground/30 focus:border-muted-foreground outline-none scrollbar-none tracking-wide"
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

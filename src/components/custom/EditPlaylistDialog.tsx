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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { SubmitEvent, useState } from "react";
import useEditPlaylistMutation from "@/features/playlists/useEditPlaylistMutation";

type EditPlaylistDialogProps = {
  playlist: Playlist;
};

const EditPlaylistDialog = ({ playlist }: EditPlaylistDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(playlist.name);

  const closeDialog = () => {
    setOpen(false);
  };

  const { mutate } = useEditPlaylistMutation({ closeDialog });

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ playlistId: playlist.id, newName: name });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit} id="edit-playlist-form">
        <DialogTrigger asChild>
          <Button variant="secondary">
            <Edit size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Edit Playlist</DialogTitle>
            <DialogDescription>
              Enter a new name for your playlist.
            </DialogDescription>
          </DialogHeader>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Classical Music"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="edit-playlist-form">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
export default EditPlaylistDialog;

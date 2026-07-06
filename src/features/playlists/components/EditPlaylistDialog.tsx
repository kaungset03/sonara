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
import useEditPlaylistMutation from "@/features/playlists/api/useEditPlaylistMutation";

type EditPlaylistDialogProps = {
  playlist: Playlist;
};

const EditPlaylistDialog = ({ playlist }: EditPlaylistDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(playlist.name);

  const isValidName = (name: string) => {
    return name.length >= 1 && name.length <= 50;
  };

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
      <form onSubmit={handleSubmit} id={`edit-playlist-form-${playlist.id}`}>
        <DialogTrigger asChild>
          <Button variant="secondary">
            <Edit size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Edit Playlist</DialogTitle>
            <DialogDescription>
              Enter a new name for your playlist.{" "}
              <span className="text-xs text-muted-foreground">
                (1-50 characters)
              </span>
            </DialogDescription>
          </DialogHeader>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Classical Music"
            minLength={1}
            maxLength={50}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              form={`edit-playlist-form-${playlist.id}`}
              disabled={!isValidName(name)}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
export default EditPlaylistDialog;

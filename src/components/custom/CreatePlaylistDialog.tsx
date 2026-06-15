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
import { PlusCircle } from "lucide-react";
import { SubmitEvent, useState } from "react";
import useCreatePlaylistMutation from "@/features/playlists/useCreatePlaylistMutation";

const CreatePlaylistDialog = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const closeDialog = () => {
    setOpen(false);
    setName("");
  };

  const { mutate } = useCreatePlaylistMutation({ closeDialog });

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(name);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit} id="create-playlist-form">
        <DialogTrigger asChild>
          <Button size="icon" variant="ghost" className="ml-auto">
            <PlusCircle size={14} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Create a new playlist</DialogTitle>
            <DialogDescription>
              Enter a name for your new playlist.
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
            <Button type="submit" form="create-playlist-form">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
export default CreatePlaylistDialog;

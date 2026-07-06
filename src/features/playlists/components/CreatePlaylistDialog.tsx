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
import useCreatePlaylistMutation from "@/features/playlists/api/useCreatePlaylistMutation";

const CreatePlaylistDialog = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const isValidName = (name: string) => {
    return name.length >= 1 && name.length <= 50;
  };

  const closeDialog = () => {
    setOpen(false);
    setName("");
  };

  const { mutate } = useCreatePlaylistMutation({ closeDialog });

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValidName(name)) {
      mutate(name);
    } else {
      // Handle invalid name case, e.g., show an error message
      console.error(
        "Invalid playlist name. Must be between 1 and 50 characters.",
      );
    }
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
              Enter a name for your new playlist.{" "}
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
              form="create-playlist-form"
              disabled={!isValidName(name)}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
export default CreatePlaylistDialog;

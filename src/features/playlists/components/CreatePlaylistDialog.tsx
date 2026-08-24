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
      console.error(
        "Invalid playlist name. Must be between 1 and 50 characters.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="ml-auto">
          <PlusCircle size={14} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new playlist</DialogTitle>
            <DialogDescription>
              Enter a name for your new playlist.
              <span className="text-xs text-muted-foreground">
                {" "}
                (1-50 characters)
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-2">
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
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={!isValidName(name)}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CreatePlaylistDialog;

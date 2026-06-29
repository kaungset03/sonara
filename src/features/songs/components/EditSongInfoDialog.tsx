import { SubmitEvent, useState } from "react";
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import useEditSongInfoMutation from "../api/useEditSongInfoMutation";

// title, artist_name, album_name, album_artist, track_number
type EditSongInfoDialogProps = {
  id: number;
  title: string;
  artist_name: string;
  album_name: string;
  album_artist: string;
  track_number: number;
};

const EditSongInfoDialog = ({
  id,
  title,
  artist_name,
  album_name,
  album_artist,
  track_number,
}: EditSongInfoDialogProps) => {
  const [open, setOpen] = useState(false);
  const [titleInput, setTitleInput] = useState(title);
  const [artistInput, setArtistInput] = useState(artist_name);
  const [albumInput, setAlbumInput] = useState(album_name);
  const [albumArtistInput, setAlbumArtistInput] = useState(album_artist);
  const [trackNumberInput, setTrackNumberInput] = useState(track_number);

  const closeDialog = () => {
    setOpen(false);
  };

  const { mutate } = useEditSongInfoMutation({ closeDialog });

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      id,
      title: titleInput,
      artistName: artistInput,
      albumName: albumInput,
      albumArtistName: albumArtistInput,
      trackNumber: trackNumberInput,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="text-xs"
          onSelect={(e) => e.preventDefault()}
          onClick={(e) => e.stopPropagation()}
        >
          Edit Song Info
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="min-w-fit"
        showCloseButton={false}
      >
        <form onSubmit={handleSubmit} id="edit-song-info-form">
          <DialogHeader>
            <DialogTitle>Edit Song Info</DialogTitle>
            <DialogDescription>
              Enter the updated information for the song.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full space-y-6 p-2 my-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="title"
                className="text-right text-xs text-muted-foreground"
              >
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="col-span-3 h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="artist"
                className="text-right text-xs text-muted-foreground"
              >
                Artist
              </Label>
              <Input
                id="artist"
                name="artist"
                value={artistInput}
                onChange={(e) => setArtistInput(e.target.value)}
                className="col-span-3 h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="album"
                className="text-right text-xs text-muted-foreground"
              >
                Album
              </Label>
              <Input
                id="album"
                name="album"
                value={albumInput}
                onChange={(e) => setAlbumInput(e.target.value)}
                className="col-span-3 h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <Label
                htmlFor="album_artist"
                className="text-right text-xs text-muted-foreground"
              >
                Album Artist
              </Label>
              <div className="col-span-3 grid grid-cols-3 gap-2">
                <Input
                  id="album_artist"
                  name="album_artist"
                  value={albumArtistInput}
                  onChange={(e) => setAlbumArtistInput(e.target.value)}
                  className="col-span-2 h-8 text-xs"
                />
                <Input
                  id="track_number"
                  name="track_number"
                  min={0}
                  defaultValue={0}
                  type="number"
                  value={trackNumberInput}
                  onChange={(e) => setTrackNumberInput(Number(e.target.value))}
                  className="h-8 text-xs text-center"
                  placeholder="Track #"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="edit-song-info-form">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default EditSongInfoDialog;

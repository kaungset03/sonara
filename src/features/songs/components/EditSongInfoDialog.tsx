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
import useEditSongInfoMutation from "@/features/songs/api/useEditSongInfoMutation";
import InputCombobox from "@/features/songs/components/InputCombobox";
import useSearchArtistsQuery from "@/features/artists/api/useSearchArtistsQuery";
import useSearchAlbumsQuery from "@/features/albums/api/useSearchAlbumsQuery";
import useDebounce from "@/hooks/useDebounce";

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

  // getting suggestions for artist input
  const debouncedArtistInput = useDebounce({
    value: artistInput,
    timeout: 350,
  });
  const { data: artistSuggestions } =
    useSearchArtistsQuery(debouncedArtistInput);

  // getting suggestions for album input
  const debouncedAlbumInput = useDebounce({
    value: albumInput,
    timeout: 350,
  });
  const { data: albumSuggestions } = useSearchAlbumsQuery(debouncedAlbumInput);

  // getting suggestions for album artist input
  const debouncedAlbumArtistInput = useDebounce({
    value: albumArtistInput,
    timeout: 350,
  });
  const { data: albumArtistSuggestions } = useSearchArtistsQuery(
    debouncedAlbumArtistInput,
  );

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
        >
          Edit Song Info
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="w-full max-w-lg p-6">
        <form
          onSubmit={handleSubmit}
          id={`edit-song-info-form-${id}`}
          className="space-y-6"
        >
          {/* Header */}
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base">Edit song details</DialogTitle>
            <DialogDescription className="text-xs">
              Update metadata for this track. Changes will be reflected in your
              library.
            </DialogDescription>
          </DialogHeader>

          {/* Body */}
          <div className="space-y-5">
            {/* Title */}
            <div className="space-y-1">
              <Label htmlFor="title" className="text-xs text-muted-foreground">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            {/* Artist */}
            <InputCombobox
              label="Artist"
              value={artistInput}
              onChange={setArtistInput}
              suggestions={artistSuggestions}
            />

            {/* Album */}
            <InputCombobox
              label="Album"
              value={albumInput}
              onChange={setAlbumInput}
              suggestions={albumSuggestions}
            />

            {/* Album Artist + Track Number */}
            <div className="grid grid-cols-3 gap-3 items-end">
              {/* Album Artist */}
              <div className="col-span-2">
                <InputCombobox
                  label="Album Artist"
                  value={albumArtistInput}
                  onChange={setAlbumArtistInput}
                  suggestions={albumArtistSuggestions}
                />
              </div>

              {/* Track Number */}
              <div className="space-y-1">
                <Label
                  htmlFor="track_number"
                  className="text-xs text-muted-foreground"
                >
                  Track Number
                </Label>
                <Input
                  id="track_number"
                  name="track_number"
                  type="number"
                  min={0}
                  value={trackNumberInput}
                  onChange={(e) => setTrackNumberInput(Number(e.target.value))}
                  className="h-9 text-xs text-center"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="gap-2 pt-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" form={`edit-song-info-form-${id}`}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default EditSongInfoDialog;

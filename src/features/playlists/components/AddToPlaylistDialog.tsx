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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type SubmitEvent, useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import useAddSongsToPlaylistMutation from "@/features/playlists/api/useAddSongsToPlaylistMutation";
import useGetAllPlaylistsQuery from "@/features/playlists/api/useGetAllPlaylistsQuery";

type AddToPlaylistDialogProps = {
  song: Song;
};

const AddToPlaylistDialog = ({ song }: AddToPlaylistDialogProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const { data: playlists } = useGetAllPlaylistsQuery();

  const closeDialog = () => {
    setOpen(false);
  };
  const { mutate } = useAddSongsToPlaylistMutation({ closeDialog });

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedId) {
      // Call the mutation to add the song to the playlist
      // addSongToPlaylist({ playlistId: selectedId, songId: song.id });
      mutate({ playlistId: selectedId, songIds: [song.id] });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit} id="add-to-playlist-form">
        <DialogTrigger asChild>
          <DropdownMenuItem
            className="text-xs"
            onSelect={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
          >
            Add to Playlist
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="max-w-40" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Add to Playlist</DialogTitle>
            <DialogDescription>
              Select a playlist to add the song to.
            </DialogDescription>
          </DialogHeader>
          <Select
            value={selectedId ? selectedId.toString() : undefined}
            onValueChange={(value) => setSelectedId(Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a playlist" />
            </SelectTrigger>
            <SelectContent position={"popper"} className="w-full">
              <SelectGroup>
                {playlists?.map((playlist) => (
                  <SelectItem key={playlist.id} value={playlist.id.toString()}>
                    {playlist.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={(e) => e.stopPropagation()} variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={(e) => e.stopPropagation()}
              type="submit"
              form="add-to-playlist-form"
              disabled={selectedId === null}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
export default AddToPlaylistDialog;

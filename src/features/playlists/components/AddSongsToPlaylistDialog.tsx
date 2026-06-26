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
import { Label } from "@/components/ui/label";
import { Check, PlusCircle } from "lucide-react";
import { SubmitEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import useGetAllSongsQuery from "@/features/songs/api/useGetAllSongsQuery";
import useAddSongsToPlaylistMutation from "@/features/playlists/api/useAddSongsToPlaylistMutation";

type AddSongsToPlaylistProps = {
  playlistId: number;
};

const AddSongsToPlaylist = ({ playlistId }: AddSongsToPlaylistProps) => {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const closeDialog = () => {
    setOpen(false);
    setSelectedIds([]);
  };

  const { data: songs } = useGetAllSongsQuery();
  const { mutate } = useAddSongsToPlaylistMutation({ closeDialog });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredSongs = songs?.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleSelection = (songId: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(songId)) {
        return prev.filter((id) => id !== songId);
      } else {
        return [...prev, songId];
      }
    });
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      playlistId,
      songIds: selectedIds,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="text-xs">
          <PlusCircle size={16} />
          Add Songs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <form onSubmit={handleSubmit} id={`add-songs-form-${playlistId}`}>
          <DialogHeader className="pb-4 space-y-1">
            <DialogTitle>Add Songs to Playlist</DialogTitle>
            <DialogDescription>
              Select songs to add from your library
            </DialogDescription>
            <Input
              placeholder="Search songs to add into playlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </DialogHeader>

          <div className="space-y-2 no-scrollbar max-h-[50vh] overflow-y-auto">
            {filteredSongs?.map((song) => (
              <Label
                key={song.id}
                className="w-full rounded-2xl flex items-center gap-3 p-3 border border-border cursor-pointer transition-colors hover:bg-muted/50"
              >
                <Input
                  type="checkbox"
                  checked={selectedIds.includes(song.id)}
                  onChange={() => toggleSelection(song.id)}
                  className="h-4 w-4 rounded-full border-border"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-medium truncate">{song.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {song.artist_name} • {song.album_name}
                  </p>
                </div>
              </Label>
            ))}
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              form={`add-songs-form-${playlistId}`}
              disabled={selectedIds.length === 0}
            >
              <Check size={16} />
              Add {selectedIds.length > 0 && `${selectedIds.length}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default AddSongsToPlaylist;

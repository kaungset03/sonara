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
import { Input } from "@/components/ui/input";
import { Check, PlusCircle } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { type SubmitEvent, useEffect, useRef, useState } from "react";
import useGetAllSongsQuery from "@/features/songs/api/useGetAllSongsQuery";
import useAddSongsToPlaylistMutation from "@/features/playlists/api/useAddSongsToPlaylistMutation";

type AddSongsToPlaylistProps = {
  playlistId: number;
};

const AddSongsToPlaylistDialog = ({ playlistId }: AddSongsToPlaylistProps) => {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const parentRef = useRef<HTMLFormElement>(null);

  const closeDialog = () => {
    setOpen(false);
    setSelectedIds([]);
  };

  const { data: songs } = useGetAllSongsQuery();
  const { mutate } = useAddSongsToPlaylistMutation({ closeDialog });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredSongs =
    searchTerm.trim() === ""
      ? (songs ?? [])
      : (songs?.filter((song) =>
          song.title.toLowerCase().includes(searchTerm.toLowerCase()),
        ) ?? []);

  const rowVirtualizer = useVirtualizer({
    count: filteredSongs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 59,
    overscan: 8,
    getItemKey: (index) => filteredSongs[index].id,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  const visibleSongs = virtualRows.map(
    (virtualRow) => filteredSongs[virtualRow.index],
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

  useEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(() => {
      rowVirtualizer.measure();
    });

    return () => cancelAnimationFrame(frame);
  }, [open, rowVirtualizer]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="text-xs">
          <PlusCircle size={16} />
          Add Songs
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-xl" showCloseButton={false}>
        <DialogHeader className="space-y-1">
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

        <form
          onSubmit={handleSubmit}
          id={`add-songs-form-${playlistId}`}
          className="no-scrollbar h-[40vh] overflow-y-auto"
          ref={parentRef}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "100%",
                transform: `translateY(${virtualRows[0]?.start ?? 0}px)`,
              }}
              className="space-y-2"
            >
              {visibleSongs.map((song) => {
                if (!song) return null;
                return (
                  <Label
                    key={song.id}
                    className="h-14 w-full mb-2 rounded-2xl flex items-center gap-3 p-3 border border-border cursor-pointer transition-colors hover:bg-muted/50"
                  >
                    <Input
                      type="checkbox"
                      checked={selectedIds.includes(song.id)}
                      onChange={() => toggleSelection(song.id)}
                      className="size-4 rounded-full border-border"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="font-medium truncate">{song.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {song.artist_name} - {song.album_name}
                      </p>
                    </div>
                  </Label>
                );
              })}
            </div>
          </div>
        </form>

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
      </DialogContent>
    </Dialog>
  );
};
export default AddSongsToPlaylistDialog;

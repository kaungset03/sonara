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
import { SubmitEvent } from "react";
import { Input } from "../ui/input";

const songs: Song[] = [
  {
    id: 1,
    title: "Song 1",
    artist: "Artist 1",
    album: "Album 1",
    duration: 210,
    is_favorite: true,
    path: "/path/to/song1.mp3",
    favorite_added_at: 1222,
    created_at: 1222,
  },
  {
    id: 2,
    title: "Song 2",
    artist: "Artist 2",
    album: "Album 2",
    duration: 180,
    is_favorite: false,
    path: "/path/to/song2.mp3",
    favorite_added_at: null,
    created_at: 1222,
  },
  {
    id: 3,
    title: "Song 3",
    artist: "Artist 3",
    album: "Album 3",
    duration: 240,
    is_favorite: true,
    path: "/path/to/song3.mp3",
    favorite_added_at: 1222,
    created_at: 1222,
  },
  {
    id: 4,
    title: "Song 4",
    artist: "Artist 4",
    album: "Album 4",
    duration: 200,
    is_favorite: false,
    path: "/path/to/song4.mp3",
    favorite_added_at: null,
    created_at: 1222,
  },
  {
    id: 5,
    title: "Song 5",
    artist: "Artist 5",
    album: "Album 5",
    duration: 220,
    is_favorite: true,
    path: "/path/to/song5.mp3",
    favorite_added_at: 1222,
    created_at: 1222,
  },
  {
    id: 6,
    title: "Song 6",
    artist: "Artist 6",
    album: "Album 6",
    duration: 190,
    is_favorite: false,
    path: "/path/to/song6.mp3",
    favorite_added_at: null,
    created_at: 1222,
  },
  {
    id: 7,
    title: "Song 7",
    artist: "Artist 7",
    album: "Album 7",
    duration: 230,
    is_favorite: true,
    path: "/path/to/song7.mp3",
    favorite_added_at: 1222,
    created_at: 1222,
  },
  {
    id: 8,
    title: "Song 8",
    artist: "Artist 8",
    album: "Album 8",
    duration: 210,
    is_favorite: false,
    path: "/path/to/song8.mp3",
    favorite_added_at: null,
    created_at: 1222,
  },
  {
    id: 9,
    title: "Song 9",
    artist: "Artist 9",
    album: "Album 9",
    duration: 250,
    is_favorite: true,
    path: "/path/to/song9.mp3",
    favorite_added_at: 1222,
    created_at: 1222,
  },
];

const AddSongsDialog = () => {
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="text-xs">
            <PlusCircle size={16} />
            Add Songs
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Add Songs to Playlist</DialogTitle>
            <DialogDescription>
              Select songs to add from your library
            </DialogDescription>
          </DialogHeader>
          <Input placeholder="Search songs, artists, or albums..." />
          <div className="space-y-2 no-scrollbar max-h-[50vh] overflow-y-auto">
            {songs.map((song) => (
              <Label
                key={song.id}
                className="w-full rounded-2xl flex items-center gap-3 p-3 border border-border cursor-pointer transition-colors hover:bg-muted/50"
              >
                <Input
                  type="checkbox"
                  checked={song.is_favorite}
                  className="h-4 w-4 rounded-full border-border"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-medium truncate">{song.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {song.artist} • {song.album}
                  </p>
                </div>
              </Label>
            ))}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              <Check size={16} />
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
export default AddSongsDialog;

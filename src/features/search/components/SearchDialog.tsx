import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookImage, Music, Search, User, X } from "lucide-react";
import SearchResultItem from "@/features/search/components/SearchResultItem";
import useSearchLibraryQuery from "@/features/search/api/useSearchLibraryQuery";
import useAppStore from "@/store/app-store";
import useDebounce from "@/hooks/useDebounce";

const SearchDialog = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce({ value: search });
  const [open, setOpen] = useState(false);

  const { data } = useSearchLibraryQuery({ search: debouncedSearch });
  const navigate = useNavigate();
  const playSong = useAppStore((state) => state.playSong);

  // actions based on search result category
  // song => play song
  // artist => navigate to artist page
  // album => navigate to album page

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex justify-start items-center border border-muted-foreground/30 gap-2 min-w-2xs"
        >
          <Search size={16} />
          <span className="text-xs font-heading">
            Search songs, artists, albums...
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle hidden>
            <span className="text-hidden">Search Library</span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Search your library for songs, artists, and albums.
          </DialogDescription>
          <div className="flex items-center gap-2">
            <Input
              autoFocus
              placeholder="Search songs, artists, albums..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <X size={16} />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        {search.trim() === "" ? (
          <div className="py-10">
            <Music size={48} className="mx-auto text-muted-foreground" />
            <p className="text-center text-muted-foreground mt-4">
              Start typing to search your library...
            </p>
          </div>
        ) : data ? (
          <div className="space-y-6 w-full max-h-[70vh] overflow-y-auto no-scrollbar">
            {/** render search results for each category */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase text-muted-foreground">
                SONGS ({data.songs.length})
              </h3>
              <div className="space-y-1">
                {data.songs.map((song) => (
                  <SearchResultItem
                    key={song.id}
                    title={song.title}
                    description={`${song.artist} • ${song.album}`}
                    icon={<Music size={16} className="text-muted-foreground" />}
                    handleClick={() => {
                      playSong(song, data.songs);
                      closeDialog()
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase text-muted-foreground">
                ARTISTS ({data.artists.length})
              </h3>
              <div className="space-y-1">
                {data.artists.map((artist) => (
                  <SearchResultItem
                    key={artist.name}
                    title={artist.name}
                    description={`${artist.count} songs`}
                    icon={<User size={16} className="text-muted-foreground" />}
                    handleClick={() => {
                      navigate({
                        to: "/artists/$name",
                        params: { name: artist.name },
                      });
                      closeDialog();
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase text-muted-foreground">
                ALBUMS ({data.albums.length})
              </h3>
              <div className="space-y-1">
                {data.albums.map((album) => (
                  <SearchResultItem
                    key={album.name}
                    title={album.name}
                    description={`${album.count} songs`}
                    icon={
                      <BookImage size={16} className="text-muted-foreground" />
                    }
                    handleClick={() => {
                      navigate({
                        to: "/albums/$name",
                        params: { name: album.name },
                      });
                      closeDialog();
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-5 w-full h-full flex justify-center items-center">
            <div className="size-5 rounded-full border-t border-primary animate-spin" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default SearchDialog;

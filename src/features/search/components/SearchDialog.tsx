import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Search, X } from "lucide-react";
import SearchResults from "@/features/search/components/SearchResults";

const SearchDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex justify-start items-center gap-2 min-w-2xs"
        >
          <Search size={16} />
          <span className="text-xs font-heading">
            Search songs, artists, albums...
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Input autoFocus placeholder="Search songs, artists, albums..." />
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <X size={16} />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        {/* <div className="py-10">
          <Music size={48} className="mx-auto text-muted-foreground" />
          <p className="text-center text-muted-foreground mt-4">
            Start typing to search your library...
          </p>
        </div> */}
        <div className="space-y-6 w-full max-h-[70vh] overflow-y-auto no-scrollbar">
          <SearchResults title="SONGS" />
          <SearchResults title="ARTISTS" />
          <SearchResults title="ALBUMS" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default SearchDialog;

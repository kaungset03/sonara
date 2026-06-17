import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { EllipsisVertical } from "lucide-react";
import AddToPlaylistDialog from "@/features/playlists/components/AddToPlaylistDialog";
import usePlayerStore from "@/store/store";

type ActionsDropdownProps = {
  song: Song;
  children?: React.ReactNode;
};

const ActionsDropdown = ({ song, children }: ActionsDropdownProps) => {
  const addToQueue = usePlayerStore((state) => state.addToQueue);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-4 hover:text-primary"
        >
          <EllipsisVertical size={14} />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {children ? children : <AddToPlaylistDialog song={song} />}
        <DropdownMenuItem
          className="text-xs"
          onClick={(e) => {
            e.stopPropagation();
            addToQueue(song);
          }}
        >
          Add to Queue
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xs" asChild>
          <Link
            to={"/artists/$name"}
            params={{ name: song.artist }}
            onClick={(e) => e.stopPropagation()}
          >
            View Artist
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xs" asChild>
          <Link
            to={"/albums/$name"}
            params={{ name: song.album }}
            onClick={(e) => e.stopPropagation()}
          >
            View Album
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ActionsDropdown;

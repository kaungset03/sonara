import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { EllipsisVertical } from "lucide-react";
import useAppStore from "@/store/app-store";
import EditSongInfoDialog from "@/features/songs/components/EditSongInfoDialog";

type ActionsDropdownProps = {
  song: Song;
  children: React.ReactNode;
};

const ActionsDropdown = ({ song, children }: ActionsDropdownProps) => {
  const addToQueue = useAppStore((state) => state.addToQueue);

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
        {children}
        <EditSongInfoDialog
          id={song.id}
          title={song.title}
          artist_name={song.artist_name}
          album_name={song.album_name}
          album_artist={song.album_artist_name}
          track_number={song.track_number}
        />
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
            onClick={(e) => e.stopPropagation()}
            to={"/artists/$id"}
            params={{ id: song.artist_id.toString() }}
          >
            View Artist
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xs" asChild>
          <Link
            onClick={(e) => e.stopPropagation()}
            to={"/albums/$id"}
            params={{ id: song.album_id.toString() }}
          >
            View Album
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ActionsDropdown;

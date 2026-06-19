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
            to={"/artists/$name"}
            params={{ name: song.artist }}
          >
            View Artist
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xs" asChild>
          <Link
            onClick={(e) => e.stopPropagation()}
            to={"/albums/$name"}
            params={{ name: song.album }}
          >
            View Album
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ActionsDropdown;

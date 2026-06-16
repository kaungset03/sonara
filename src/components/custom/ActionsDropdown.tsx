import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { EllipsisVertical } from "lucide-react";

type ActionsDropdownProps = {
  song: Song;
  children?: React.ReactNode;
};

const ActionsDropdown = ({ song, children }: ActionsDropdownProps) => {
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
        <DropdownMenuItem className="text-xs">Add to Queue</DropdownMenuItem>
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

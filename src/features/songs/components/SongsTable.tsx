import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Heart, Music2 } from "lucide-react";
import { getFormattedDuration } from "@/lib/helpers";
import useToggleFavoriteMutation from "@/features/songs/api/useToggleFavoriteMutation";
import ActionsDropdown from "@/features/songs/components/ActionsDropdown";
import useCurrentSong from "@/hooks/useCurrentSong";

type SongsTableProps = {
  songs: Song[];
  handleSongClick: (song: Song) => void;
  renderActions?: (song: Song) => React.ReactNode;
};

const SongsTable = ({
  songs,
  handleSongClick,
  renderActions,
}: SongsTableProps) => {
  const currentSong = useCurrentSong();
  const { mutate } = useToggleFavoriteMutation();

  const toggleFavorite = (song: Song) => {
    console.log("Toggling favorite for song:", song);
    mutate({ songId: song.id, isFavorite: !song.is_favorite });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-10 text-center">#</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Album</TableHead>
          <TableHead className="text-center">Duration</TableHead>
          <TableHead className="text-center"> </TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-xs">
        {songs.map((song, index) => {
          const isActive = currentSong?.id === song.id;

          return (
            <TableRow
              key={song.id}
              className={`cursor-pointer ${
                isActive ? "text-primary" : "hover:bg-muted"
              }`}
              onClick={() => handleSongClick(song)}
            >
              <TableCell className="w-10 text-center">
                {isActive ? <Music2 size={14} /> : index + 1}
              </TableCell>
              <TableCell className="min-w-65 max-w-sm overflow-hidden truncate">
                {song.title}
              </TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>{song.album}</TableCell>
              <TableCell className="text-center">
                {getFormattedDuration(song.duration)}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-4 hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(song);
                  }}
                >
                  {song.is_favorite ? (
                    <Heart fill="currentColor" size={14} />
                  ) : (
                    <Heart size={14} />
                  )}
                </Button>
              </TableCell>
              <TableCell className="flex justify-center items-center">
                <ActionsDropdown song={song}>
                  {renderActions && renderActions(song)}
                </ActionsDropdown>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
export default SongsTable;

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
import usePlayerStore from "@/store/store";
import useToggleFavoriteMutation from "@/features/favorites/useToggleFavoriteMutation";

type SongsTableProps = {
  songs: Song[];
  handleSongClick: (song: Song) => void;
};

const SongsTable = ({ songs, handleSongClick }: SongsTableProps) => {
  const currentSong = usePlayerStore((state) => state.currentSong);
  const { mutate } = useToggleFavoriteMutation();

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
        </TableRow>
      </TableHeader>
      <TableBody className="text-sm">
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
              <TableCell>{song.title}</TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>{song.album}</TableCell>
              <TableCell className="text-center">
                {getFormattedDuration(song.duration)}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground border border-border"
                  onClick={(e) => {
                    e.stopPropagation();
                    mutate({ songId: song.id, isFavorite: !song.is_favorite });
                  }}
                >
                  {song.is_favorite ? (
                    <Heart size={14} fill="currentColor" />
                  ) : (
                    <Heart size={14} />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
export default SongsTable;

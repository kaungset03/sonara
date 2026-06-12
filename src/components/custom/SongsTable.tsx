import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFormattedDuration } from "@/lib/helpers";
import { Heart, Music } from "lucide-react";
import usePlayerStore from "@/store/store";

type SongsTableProps = {
  songs: Song[];
  handleSongClick: (song: Song) => void;
};

const SongsTable = ({ songs, handleSongClick }: SongsTableProps) => {
  const currentSong = usePlayerStore((state) => state.currentSong);
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>#</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Album</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead> </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {songs.map((song, index) => {
          const isActive = currentSong?.id === song.id;

          if (isActive) {
            return (
              <TableRow
                key={song.id}
                className="cursor-pointer text-primary"
                onClick={() => handleSongClick(song)}
              >
                <TableCell>
                  <Music size={18} />
                </TableCell>
                <TableCell>{song.title}</TableCell>
                <TableCell>{song.artist}</TableCell>
                <TableCell>{song.album}</TableCell>
                <TableCell>{getFormattedDuration(song.duration)}</TableCell>
                <TableCell>
                  <Heart size={18} />
                </TableCell>
              </TableRow>
            );
          }

          return (
            <TableRow
              key={song.id}
              className="cursor-pointer hover:bg-muted"
              onClick={() => handleSongClick(song)}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{song.title}</TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>{song.album}</TableCell>
              <TableCell>{getFormattedDuration(song.duration)}</TableCell>
              <TableCell>
                <Heart size={18} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
export default SongsTable;

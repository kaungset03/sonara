import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFormattedDuration } from "@/lib/helpers";
import { Heart, Music2 } from "lucide-react";
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
              <TableCell className="w-10 text-center flex items-center justify-center">
                {isActive ? <Music2 size={14} /> : index + 1}
              </TableCell>
              <TableCell>{song.title}</TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>{song.album}</TableCell>
              <TableCell className="text-center">
                {getFormattedDuration(song.duration)}
              </TableCell>
              <TableCell className="text-center">
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFormattedDuration } from "@/lib/helpers";
import useGetAllSongsQuery from "@/features/songs/useGetAllSongsQuery";

const SongsTable = () => {
  const songs = useGetAllSongsQuery();
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>#</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Album</TableHead>
          <TableHead>Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {songs?.map((song, index) => (
          <TableRow key={song.id} className="cursor-pointer hover:bg-muted">
            <TableCell>{index + 1}</TableCell>
            <TableCell>{song.title}</TableCell>
            <TableCell>{song.artist}</TableCell>
            <TableCell>{song.album}</TableCell>
            <TableCell>{getFormattedDuration(song.duration)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default SongsTable;

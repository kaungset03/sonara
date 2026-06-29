import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Heart, Music2, Play } from "lucide-react";
import { getFormattedDuration } from "@/lib/helpers";
import useToggleFavoriteMutation from "@/features/songs/api/useToggleFavoriteMutation";
import ActionsDropdown from "@/features/songs/components/ActionsDropdown";
import useCurrentSong from "@/hooks/useCurrentSong";
import AddToPlaylistDialog from "@/features/playlists/components/AddToPlaylistDialog";

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
              className={`group ${isActive ? "text-primary" : "hover:bg-primary/10"}`}
            >
              <TableCell
                className="w-10 text-center cursor-pointer"
                onClick={() => handleSongClick(song)}
              >
                <div className="flex items-center justify-center">
                  {isActive ? (
                    <Music2 size={14} />
                  ) : (
                    <>
                      <span className="group-hover:hidden">{index + 1}</span>

                      <Play size={14} className="hidden group-hover:block" />
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell
                onClick={() => handleSongClick(song)}
                className="min-w-35 max-w-50 overflow-hidden truncate cursor-pointer"
              >
                {song.title}
              </TableCell>
              <TableCell>{song.artist_name}</TableCell>
              <TableCell className="max-w-45 overflow-hidden truncate">
                {song.album_name}
              </TableCell>
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
                  {renderActions ? (
                    renderActions(song)
                  ) : (
                    <AddToPlaylistDialog song={song} />
                  )}
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

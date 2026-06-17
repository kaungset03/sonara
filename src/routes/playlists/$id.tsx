import { createFileRoute } from "@tanstack/react-router";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Play, Shuffle } from "lucide-react";
import usePlayerStore from "@/store/store";
import EditPlaylistDialog from "@/features/playlists/components/EditPlaylistDialog";
import DeletePlaylistAlert from "@/features/playlists/components/DeletePlaylistAlert";
import SongsTable from "@/features/songs/components/SongsTable";
import AddSongsToPlaylistDialog from "@/features/playlists/components/AddSongsToPlaylistDialog";
import useGetSongsByPlaylistQuery from "@/features/playlists/api/useGetSongsByPlaylistQuery";
import useRemoveSongFromPlaylistMutation from "@/features/playlists/api/useRemoveSongFromPlaylistMutation";

export const Route = createFileRoute("/playlists/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data } = useGetSongsByPlaylistQuery(Number(id));
  const songs = data?.songs;

  const { mutate } = useRemoveSongFromPlaylistMutation();

  const playSong = usePlayerStore((state) => state.playSong);
  const isShuffle = usePlayerStore((state) => state.isShuffle);
  const setIsShuffle = usePlayerStore((state) => state.setIsShuffle);

  const handleSongClick = (song: Song) => {
    if (songs) {
      playSong(song, songs);
    }
  };

  const handlePlayAll = () => {
    if (songs) {
      // play the first song, which will set the entire playlist as the queue
      playSong(songs[0], songs);
    }
  };

  const handleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const handleRemoveFromPlaylist = (songId: number) => {
    mutate({ songId, playlistId: Number(id) });
  };

  if (!songs) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col gap-6 mb-8 border-b pb-8">
        <div>
          <div className="flex items-center gap-x-12">
            <h1 className="text-4xl font-bold font-heading tracking-tight mb-2">
              {data?.playlist.name}
            </h1>
            <div className="flex items-center gap-2">
              <EditPlaylistDialog playlist={data?.playlist} />
              <DeletePlaylistAlert playlistId={Number(id)} />
            </div>
          </div>

          <p className="text-muted-foreground">
            {songs.length} {songs.length === 1 ? "Song" : "Songs"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={handlePlayAll} className="gap-2 text-xs">
            <Play size={16} fill="currentColor" />
            Play All
          </Button>
          <Button
            onClick={handleShuffle}
            variant="outline"
            className="gap-2 text-xs"
          >
            <Shuffle size={16} />
            Shuffle
          </Button>
          <AddSongsToPlaylistDialog playlistId={Number(id)} />
        </div>
      </div>

      <div>
        {songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 h-full">
            <p className="text-muted-foreground text-sm">
              No songs in this playlist yet.
            </p>
            <AddSongsToPlaylistDialog playlistId={Number(id)} />
          </div>
        ) : (
          <SongsTable
            songs={songs}
            handleSongClick={handleSongClick}
            renderActions={(song) => (
              <DropdownMenuItem
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromPlaylist(song.id);
                }}
              >
                Remove from Playlist
              </DropdownMenuItem>
            )}
          />
        )}
      </div>
    </div>
  );
}

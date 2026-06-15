import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Play, Shuffle } from "lucide-react";
import usePlayerStore from "@/store/store";
import SongsTable from "@/components/custom/SongsTable";
import AddSongsDialog from "@/components/custom/AddSongsDialog";
import useGetSongsByPlaylistQuery from "@/features/playlists/useGetSongsByPlaylistQuery";

export const Route = createFileRoute("/playlists/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data } = useGetSongsByPlaylistQuery(Number(id));
  const songs = data?.songs;

  const { setCurrentSongId, setIsPlaying, setQueue } = usePlayerStore();

  const handleSongClick = (song: Song) => {
    if (!songs) return;
    setCurrentSongId(song.id);
    setQueue(songs);
    setIsPlaying(true);
  };

  const handlePlayAll = () => {
    if (!songs) return;
    if (songs.length > 0) {
      setCurrentSongId(songs[0].id);
      setQueue(songs);
      setIsPlaying(true);
    }
  };

  const handleShuffle = () => {
    if (!songs) return;
    if (songs.length > 0) {
      const shuffled = [...songs].sort(() => Math.random() - 0.5);
      setCurrentSongId(shuffled[0].id);
      setQueue(shuffled);
      setIsPlaying(true);
    }
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
          <h1 className="text-4xl font-bold font-heading tracking-tight mb-2">
            {data?.playlist.name}
          </h1>
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
          <AddSongsDialog playlistId={Number(id)} />
        </div>
      </div>

      <div>
        {songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 h-full">
            <p className="text-muted-foreground text-sm">
              No songs in this playlist yet.
            </p>
            <AddSongsDialog playlistId={Number(id)} />
          </div>
        ) : (
          <SongsTable songs={songs} handleSongClick={handleSongClick} />
        )}
      </div>
    </div>
  );
}

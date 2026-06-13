import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Play, Shuffle } from "lucide-react";
import usePlayerStore from "@/store/store";
import SongsTable from "@/components/custom/SongsTable";
import useGetSongsByArtistQuery from "@/features/artists/useGetSongsByArtistQuery";

export const Route = createFileRoute("/artists/$name")({
  component: RouteComponent,
});

function RouteComponent() {
  const { name } = Route.useParams();
  const { data: artistSongs } = useGetSongsByArtistQuery(name);
  const { setCurrentSongId, setIsPlaying, setQueue } = usePlayerStore();

  const handleSongClick = (song: Song) => {
    if (!artistSongs) return;
    setCurrentSongId(song.id);
    setQueue(artistSongs);
    setIsPlaying(true);
  };

  const handlePlayAll = () => {
    if (!artistSongs) return;
    if (artistSongs.length > 0) {
      setCurrentSongId(artistSongs[0].id);
      setQueue(artistSongs);
      setIsPlaying(true);
    }
  };

  const handleShuffle = () => {
    if (!artistSongs) return;
    if (artistSongs.length > 0) {
      const shuffled = [...artistSongs].sort(() => Math.random() - 0.5);
      setCurrentSongId(shuffled[0].id);
      setQueue(shuffled);
      setIsPlaying(true);
    }
  };

  if (!artistSongs) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col gap-6 mb-8 border-b pb-8">
        <div>
          <h1 className="text-4xl font-bold font-heading tracking-tight mb-2">
            {name}
          </h1>
          <p className="text-muted-foreground">
            {artistSongs.length} {artistSongs.length === 1 ? "Song" : "Songs"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={handlePlayAll} className="gap-2 text-xs">
            <Play size={16} fill="currentColor" />
            Play All
          </Button>
          <Button
            onClick={handleShuffle}
            variant="secondary"
            className="gap-2 text-xs"
          >
            <Shuffle size={16} />
            Shuffle
          </Button>
        </div>
      </div>

      <div>
        <SongsTable songs={artistSongs} handleSongClick={handleSongClick} />
      </div>
    </div>
  );
}

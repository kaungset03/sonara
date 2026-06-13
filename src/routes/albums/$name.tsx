import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Play, Shuffle } from "lucide-react";
import usePlayerStore from "@/store/store";
import SongsTable from "@/components/custom/SongsTable";
import useGetSongsByAlbumQuery from "@/features/albums/useGetSongsByAlbumQuery";

export const Route = createFileRoute("/albums/$name")({
  component: RouteComponent,
});

function RouteComponent() {
  const { name } = Route.useParams();
  const { data: albumSongs } = useGetSongsByAlbumQuery(name);
  const { setCurrentSongId, setIsPlaying, setQueue } = usePlayerStore();

  const handleSongClick = (song: Song) => {
    if (!albumSongs) return;
    setCurrentSongId(song.id);
    setQueue(albumSongs);
    setIsPlaying(true);
  };

  const handlePlayAll = () => {
    if (!albumSongs) return;
    if (albumSongs.length > 0) {
      setCurrentSongId(albumSongs[0].id);
      setQueue(albumSongs);
      setIsPlaying(true);
    }
  };

  const handleShuffle = () => {
    if (!albumSongs) return;
    if (albumSongs.length > 0) {
      const shuffled = [...albumSongs].sort(() => Math.random() - 0.5);
      setCurrentSongId(shuffled[0].id);
      setQueue(shuffled);
      setIsPlaying(true);
    }
  };

  if (!albumSongs) {
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
            {albumSongs.length} {albumSongs.length === 1 ? "Song" : "Songs"}
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
        <SongsTable songs={albumSongs} handleSongClick={handleSongClick} />
      </div>
    </div>
  );
}

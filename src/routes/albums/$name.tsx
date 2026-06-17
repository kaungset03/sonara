import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Play, Shuffle } from "lucide-react";
import usePlayerStore from "@/store/store";
import useGetSongsByAlbumQuery from "@/features/albums/api/useGetSongsByAlbumQuery";
import SongsTable from "@/features/songs/components/SongsTable";

export const Route = createFileRoute("/albums/$name")({
  component: RouteComponent,
});

function RouteComponent() {
  const { name } = Route.useParams();
  const { data: songs } = useGetSongsByAlbumQuery(name);

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

  if (!songs) {
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
            variant="secondary"
            className="gap-2 text-xs"
          >
            <Shuffle size={16} />
            Shuffle
          </Button>
        </div>
      </div>

      <div>
        <SongsTable songs={songs} handleSongClick={handleSongClick} />
      </div>
    </div>
  );
}

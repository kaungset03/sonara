import { createFileRoute } from "@tanstack/react-router";
import { convertFileSrc } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { Music, Play, Shuffle } from "lucide-react";
import useAppStore from "@/store/app-store";
import useGetSongsByAlbumQuery from "@/features/albums/api/useGetSongsByAlbumQuery";
import UpdateAlbumCoverButton from "@/features/albums/components/UpdateAlbumCoverButton";
import SongsTable from "@/features/songs/components/SongsTable";

export const Route = createFileRoute("/albums/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data } = useGetSongsByAlbumQuery(parseInt(id));

  const playSong = useAppStore((state) => state.playSong);
  const isShuffle = useAppStore((state) => state.isShuffle);
  const setIsShuffle = useAppStore((state) => state.setIsShuffle);

  // order by track number, then by name
  const songs = data?.songs;

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
      <div className="flex items-center gap-x-6 border-b border-muted-foreground/30 pb-8 mb-4">
        <div className="relative group">
          <div className="size-50 rounded-lg overflow-hidden bg-linear-to-br from-primary/30 to-primary/10 flex items-center justify-center shadow-lg">
            {data.album.cover_path ? (
              <img
                src={convertFileSrc(data.album.cover_path)}
                alt={data.album.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-primary/50">
                <Music size={80} />
              </div>
            )}
          </div>
          <UpdateAlbumCoverButton albumId={data.album.id} />
        </div>
        <div className="flex flex-col gap-y-2">
          <h1 className="text-3xl font-bold font-heading tracking-tight">
            {data.album.name}
          </h1>
          <p className="text-muted-foreground">by {data.album.artist_name}</p>
          <p className="text-muted-foreground">
            {songs.length} {songs.length === 1 ? "Song" : "Songs"}
          </p>

          <div className="flex items-center gap-4 mt-4">
            <Button onClick={handlePlayAll} className="gap-2 text-xs">
              <Play size={16} fill="currentColor" />
              Play All
            </Button>
            <Button
              onClick={handleShuffle}
              variant={isShuffle ? "default" : "outline"}
              className="gap-2 text-xs border border-muted-foreground/30"
            >
              <Shuffle size={16} />
              Shuffle
            </Button>
          </div>
        </div>
      </div>

      <div>
        <SongsTable songs={songs} handleSongClick={handleSongClick} />
      </div>
    </div>
  );
}

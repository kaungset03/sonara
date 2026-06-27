import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Play, Shuffle, User } from "lucide-react";
import useAppStore from "@/store/app-store";
import useGetSongsByArtistQuery from "@/features/artists/api/useGetSongsByArtistQuery";
import SongsTable from "@/features/songs/components/SongsTable";
import UpdateArtistImageButton from "@/features/artists/components/UpdateArtistImageButton";
import { convertFileSrc } from "@tauri-apps/api/core";

export const Route = createFileRoute("/artists/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data } = useGetSongsByArtistQuery(parseInt(id));

  const playSong = useAppStore((state) => state.playSong);
  const isShuffle = useAppStore((state) => state.isShuffle);
  const setIsShuffle = useAppStore((state) => state.setIsShuffle);

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
          <div className="size-45 rounded-full overflow-hidden bg-linear-to-br from-primary/30 to-primary/10 flex items-center justify-center shadow-lg">
            {data.artist.image_path ? (
              <img
                src={convertFileSrc(data.artist.image_path)}
                alt={data.artist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-primary/50">
                <User size={80} />
              </div>
            )}
          </div>
          <UpdateArtistImageButton artistId={data.artist.id} />
        </div>
        <div className="flex flex-col gap-y-2">
          <h1 className="text-4xl font-bold font-heading tracking-tight">
            {data.artist.name}
          </h1>
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

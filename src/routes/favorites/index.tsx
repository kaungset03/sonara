import { createFileRoute } from "@tanstack/react-router";
import useGetFavoriteSongsQuery from "@/features/songs/api/useGetFavoriteSongsQuery";
import usePlayerStore from "@/store/store";
import SongsTable from "@/features/songs/components/SongsTable";

export const Route = createFileRoute("/favorites/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useGetFavoriteSongsQuery();
  const playSong = usePlayerStore((state) => state.playSong);

  const handleSongSelect = (song: Song) => {
    if (data) {
      playSong(song, data);
    }
  };

  return (
    <div>
      {data && <SongsTable songs={data} handleSongClick={handleSongSelect} />}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import useGetFavoriteSongsQuery from "@/features/songs/api/useGetFavoriteSongsQuery";
import SongsTable from "@/features/songs/components/SongsTable";
import useAppStore from "@/store/app-store";

export const Route = createFileRoute("/favorites/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useGetFavoriteSongsQuery();
  const playSong = useAppStore((state) => state.playSong);

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

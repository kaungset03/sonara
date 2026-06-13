import { createFileRoute } from "@tanstack/react-router";
import SongsTable from "@/components/custom/SongsTable";
import useGetFavoriteSongsQuery from "@/features/favorites/useGetFavoriteSongsQuery";
import usePlayerStore from "@/store/store";

export const Route = createFileRoute("/favorites/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useGetFavoriteSongsQuery();
  const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
  const setQueue = usePlayerStore((state) => state.setQueue);

  const handleSongSelect = (song: Song) => {
    if (!data) return;
    setCurrentSong(song);
    setQueue(data);
  };

  return (
    <div>
      {data && <SongsTable songs={data} handleSongClick={handleSongSelect} />}
    </div>
  );
}

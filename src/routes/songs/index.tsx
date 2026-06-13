import { createFileRoute } from "@tanstack/react-router";
import SongsTable from "@/components/custom/SongsTable";
import useGetAllSongsQuery from "@/features/songs/useGetAllSongsQuery";
import usePlayerStore from "@/store/store";

export const Route = createFileRoute("/songs/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useGetAllSongsQuery();
  const setCurrentSongId = usePlayerStore((state) => state.setCurrentSongId);
  const setQueue = usePlayerStore((state) => state.setQueue);

  const handleSongSelect = (song: Song) => {
    if (!data) return;
    setCurrentSongId(song.id);
    setQueue(data);
  };

  return (
    <div>
      {data && <SongsTable songs={data} handleSongClick={handleSongSelect} />}
    </div>
  );
}

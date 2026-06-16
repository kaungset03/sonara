import { createFileRoute } from "@tanstack/react-router";
import useGetAllSongsQuery from "@/features/songs/useGetAllSongsQuery";
import usePlayerStore from "@/store/store";
import SongsTable from "@/components/custom/SongsTable";

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
    setQueue(data.map((song) => ({ id: crypto.randomUUID(), song })));
  };

  // No data, show loading
  // data and length is 0, show empty state
  // if data exists, show table

  return (
    <div>
      {data && <SongsTable songs={data} handleSongClick={handleSongSelect} />}
    </div>
  );
}

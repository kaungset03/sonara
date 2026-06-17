import { createFileRoute } from "@tanstack/react-router";
import useGetAllSongsQuery from "@/features/songs/api/useGetAllSongsQuery";
import usePlayerStore from "@/store/store";
import SongsTable from "@/features/songs/components/SongsTable";

export const Route = createFileRoute("/songs/")({
  component: RouteComponent,
});

// get all songs from db

function RouteComponent() {
  const { data } = useGetAllSongsQuery();
  const playSong = usePlayerStore((state) => state.playSong);

  const handleSongSelect = (song: Song) => {
    if (!data) return;
    playSong(song, data);
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

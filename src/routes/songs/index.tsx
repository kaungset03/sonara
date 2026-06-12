import { createFileRoute } from "@tanstack/react-router";
import SongsTable from "@/components/custom/SongsTable";
import useGetAllSongsQuery from "@/features/songs/useGetAllSongsQuery";
import usePlayerStore from "@/store/store";

export const Route = createFileRoute("/songs/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { songs } = useGetAllSongsQuery();
  const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
  const setQueue = usePlayerStore((state) => state.setQueue);

  const handleSongSelect = (song: Song) => {
    if (!songs) return;
    setCurrentSong(song);
    setQueue(songs);
  };

  return (
    <div>
      {songs && <SongsTable songs={songs} handleSongClick={handleSongSelect} />}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import useGetAllSongsQuery from "@/features/songs/api/useGetAllSongsQuery";
import useAppStore from "@/store/app-store";
import SongsTable from "@/features/songs/components/SongsTable";
import EmptySongAlert from "@/components/custom/EmptySongAlert";

export const Route = createFileRoute("/songs/")({
  component: RouteComponent,
});

// get all songs from db

function RouteComponent() {
  const { data } = useGetAllSongsQuery();
  const playSong = useAppStore((state) => state.playSong);

  const handleSongSelect = (song: Song) => {
    if (!data) return;
    playSong(song, data);
  };

  if (data) {
    return (
      <div>
        {data.length === 0 ? (
          <EmptySongAlert />
        ) : (
          <SongsTable songs={data} handleSongClick={handleSongSelect} />
        )}
      </div>
    );
  }
}

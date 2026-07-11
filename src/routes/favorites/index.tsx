import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import useGetFavoriteSongsQuery from "@/features/songs/api/useGetFavoriteSongsQuery";
import SongsTable from "@/features/songs/components/SongsTable";
import useAppStore from "@/store/app-store";
import Loading from "@/components/custom/Loading";

export const Route = createFileRoute("/favorites/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { data, isFetching } = useGetFavoriteSongsQuery();
  const playSong = useAppStore((state) => state.playSong);

  const handleSongSelect = (song: Song) => {
    if (data) {
      playSong(song, data);
    }
  };

  if (isFetching) {
    return <Loading />;
  }

  if (data && data.length > 0) {
    return <SongsTable songs={data} handleSongClick={handleSongSelect} />;
  }

  return (
    <Empty className="mt-20">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Music size={48} className="text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>No Favorite Songs</EmptyTitle>
        <EmptyDescription>
          You have no favorite songs yet. Start adding some to your favorites!
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          variant={"secondary"}
          className="text-xs"
          onClick={() => navigate({ to: "/songs" })}
        >
          Browse Songs
        </Button>
      </EmptyContent>
    </Empty>
  );
}

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
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
  const { data, isLoading } = useGetFavoriteSongsQuery();
  const playSong = useAppStore((state) => state.playSong);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 8,
    getItemKey: (index) => data?.[index].id ?? index,
  });

  const handleSongSelect = (song: Song) => {
    if (data) {
      playSong(song, data);
    }
  };

  if (!data || isLoading) {
    return <Loading />;
  }

  if (data.length <= 0) {
    return (
      <Empty className="mt-45">
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

  const virtualRows = rowVirtualizer.getVirtualItems();
  const visibleSongs = virtualRows.map((row) => data?.[row.index]);

  return (
    <main
      className="p-2 pt-18 pb-25 w-full h-screen overflow-y-auto custom-scrollbar"
      ref={parentRef}
    >
      <div
        style={{
          height: rowVirtualizer.getTotalSize(),
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            transform: `translateY(${virtualRows[0]?.start ?? 0}px)`,
          }}
        >
          <SongsTable songs={visibleSongs} handleSongClick={handleSongSelect} />
        </div>
      </div>
    </main>
  );
}

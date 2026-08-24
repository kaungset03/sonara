import { createFileRoute } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import useGetAllSongsQuery from "@/features/songs/api/useGetAllSongsQuery";
import useAppStore from "@/store/app-store";
import SongsTable from "@/features/songs/components/SongsTable";
import EmptySongAlert from "@/components/custom/EmptySongAlert";
import Loading from "@/components/custom/Loading";

export const Route = createFileRoute("/songs/")({
  component: RouteComponent,
});

// get all songs from db

function RouteComponent() {
  const { data, isLoading } = useGetAllSongsQuery();
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
    if (!data) return;
    playSong(song, data);
  };

  if (!data || isLoading) {
    return <Loading />;
  }

  if (data.length === 0) {
    return <EmptySongAlert />;
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

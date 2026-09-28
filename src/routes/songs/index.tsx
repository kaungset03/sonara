import {
  createFileRoute,
  useElementScrollRestoration,
} from "@tanstack/react-router";
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

function RouteComponent() {
  const { data: songs, isLoading } = useGetAllSongsQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (!songs || songs.length === 0) {
    return <EmptySongAlert />;
  }

  return <SongsList songs={songs} />;
}

const SongsList = ({ songs }: { songs: Song[] }) => {
  const playSong = useAppStore((state) => state.playSong);
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollRestorationId = "SongsList";

  const scrollEntry = useElementScrollRestoration({
    id: scrollRestorationId,
  });

  const rowVirtualizer = useVirtualizer({
    count: songs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 8,
    getItemKey: (index) => songs[index]?.id ?? index,
    initialOffset: scrollEntry?.scrollY,
  });

  const handleSongSelect = (song: Song) => {
    playSong(song, songs);
  };

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <main
      ref={parentRef}
      className="p-2 pt-18 pb-32 w-full h-screen overflow-y-auto custom-scrollbar"
      data-scroll-restoration-id={scrollRestorationId}
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
          <SongsTable
            songs={virtualRows.map((row) => songs[row.index])}
            handleSongClick={handleSongSelect}
            startIndex={virtualRows[0]?.index ?? 0}
          />
        </div>
      </div>
    </main>
  );
};

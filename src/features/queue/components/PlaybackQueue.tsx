import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ListMusic } from "lucide-react";
import { getFormattedDuration } from "@/lib/helpers";
import useAppStore from "@/store/app-store";
import QueueItem from "@/features/queue/components/QueueItem";

const PlaybackQueue = () => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const playbackQueue = useAppStore((state) => state.playbackQueue);
  const currentQueueItem = useAppStore((state) => state.currentQueueItem);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const totalQueueDuration = useMemo(() => {
    const songs = queryClient.getQueryData<Song[]>(["songs"]) ?? [];

    return playbackQueue.reduce((totalDuration, queueItem) => {
      const song = songs.find((item) => item.id === queueItem.songId);

      return totalDuration + (song?.duration ?? 0);
    }, 0);
  }, [playbackQueue, queryClient]);

  const rowVirtualizer = useVirtualizer({
    count: playbackQueue.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 64,
    overscan: 8,
    getItemKey: (index) => playbackQueue[index]?.id ?? index,
  });

  useEffect(() => {
    if (!currentQueueItem || !open) return;

    const index = playbackQueue.findIndex(
      (queueItem) => queueItem.id === currentQueueItem.id,
    );

    if (index === -1) return;

    const timer = setTimeout(() => {
      rowVirtualizer.scrollToIndex(index, {
        align: "center",
        behavior: "smooth",
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [currentQueueItem, open, playbackQueue, rowVirtualizer]);

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="border border-muted-foreground/30"
        >
          <ListMusic />
        </Button>
      </SheetTrigger>

      <SheetContent showCloseButton={false}>
        <SheetHeader className="h-25">
          <SheetTitle>Playback Queue ({playbackQueue.length} Songs)</SheetTitle>

          <SheetDescription>
            Duration: {getFormattedDuration(totalQueueDuration)}
          </SheetDescription>
        </SheetHeader>

        <div
          ref={scrollContainerRef}
          className="flex flex-col px-2 max-h-[calc(100vh-180px)] overflow-y-auto no-scrollbar"
        >
          <div
            style={{
              height: rowVirtualizer.getTotalSize(),
              width: "100%",
              position: "relative",
            }}
          >
            {virtualItems.map((virtualItem) => {
              const queueItem = playbackQueue[virtualItem.index];

              return (
                <div
                  key={queueItem.id}
                  data-index={virtualItem.index}
                  ref={rowVirtualizer.measureElement}
                  className="absolute left-0 top-0 w-full"
                  style={{
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <QueueItem
                    queueItem={queueItem}
                    isCurrentPlaying={queueItem.id === currentQueueItem?.id}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <SheetFooter className="h-20">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default PlaybackQueue;

import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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

  const itemsRef = useRef<Record<string, HTMLDivElement | null>>({});

  const totalQueueDuration = useMemo(() => {
    const songs = queryClient.getQueryData<Song[]>(["songs"]) ?? [];

    return playbackQueue.reduce((totalDuration, queueItem) => {
      const song = songs.find((item) => item.id === queueItem.songId);

      return totalDuration + (song?.duration ?? 0);
    }, 0);
  }, [playbackQueue, queryClient]);

  useEffect(() => {
    if (!currentQueueItem || !open) return;
    const timer = setTimeout(() => {
      const el = itemsRef.current[currentQueueItem.id];

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [currentQueueItem, open]);

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
        <div className="flex flex-col px-2 max-h-[calc(100vh-180px)] overflow-y-auto no-scrollbar">
          {playbackQueue.map((queueItem) => (
            <div
              key={queueItem.id}
              ref={(el) => {
                itemsRef.current[queueItem.id] = el;
              }}
            >
              <QueueItem
                queueItem={queueItem}
                isCurrentPlaying={queueItem.id === currentQueueItem?.id}
              />
            </div>
          ))}
          <span className="text-xs text-muted-foreground text-center mt-4">
            End of Queue
          </span>
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

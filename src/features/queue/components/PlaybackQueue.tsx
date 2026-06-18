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
import usePlayerStore from "@/store/store";
import QueueItem from "@/features/queue/components/QueueItem";
import { useEffect, useRef, useState } from "react";

const PlaybackQueue = () => {
  const [open, setOpen] = useState(false);

  const playbackQueue = usePlayerStore((state) => state.playbackQueue);
  const currentQueueItem = usePlayerStore((state) => state.currentQueueItem);

  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    // 1. Guard clause: Don't do anything if queue is empty or sheet is closed
    if (!currentQueueItem || !open) return;

    // 2. Wait a split second for the Shadcn sheet entry animation to settle
    const timer = setTimeout(() => {
      const el = itemRefs.current[currentQueueItem.id];

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        console.log("Scrolling to current queue item:", currentQueueItem.id);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [currentQueueItem?.id, open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="border border-primary">
          <ListMusic size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="h-25">
          <SheetTitle>Playback Queue</SheetTitle>
          <SheetDescription>
            View and manage your playback queue.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col p-2 max-h-[calc(100vh-180px)] overflow-y-auto no-scrollbar">
          {playbackQueue.map((queueItem) => (
            <div
              key={queueItem.id}
              ref={(el) => {
                itemRefs.current[queueItem.id] = el;
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

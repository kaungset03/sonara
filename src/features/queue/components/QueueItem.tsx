import { Music, Play } from "lucide-react";
import { getFormattedDuration } from "@/lib/helpers";
import useSongById from "@/features/queue/hooks/useSongById";
import usePlayerStore from "@/store/store";

type QueueItemProps = {
  queueItem: QueueItem;
  isCurrentPlaying?: boolean;
};

const QueueItem = ({ queueItem, isCurrentPlaying }: QueueItemProps) => {
  const song = useSongById(queueItem.songId);
  const setCurrentQueueItem = usePlayerStore((state) => state.setCurrentQueueItem);

  const handleSelectQueueItem = () => {
    setCurrentQueueItem(queueItem);
  };

  return (
    <div
      className={`group flex items-center gap-3 px-3 py-2 rounded-xl transition-colors
  ${isCurrentPlaying ? "bg-primary/20" : "bg-card/50 hover:bg-muted"}`}
    >
      <div className="relative w-12 h-12 rounded-md bg-linear-to-br from-primary/30 to-primary/10 shrink-0 flex items-center justify-center overflow-hidden">
        <Music className="size-5 text-primary/50" />
        <button className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/50" onClick={handleSelectQueueItem}>
          {!isCurrentPlaying && (
            <Play className="size-4 text-white opacity-0 transition-opacity group-hover:opacity-100 fill-white" />
          )}
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className={`font-medium text-sm truncate transition-colors
  ${
    isCurrentPlaying
      ? "text-primary"
      : "text-foreground group-hover:text-primary"
  }`}
        >
          {song?.title}
        </h3>
        <p className="text-xs text-muted-foreground truncate">{song?.artist}</p>
      </div>
      <div className="text-xs text-muted-foreground shrink-0">
        {song && getFormattedDuration(song.duration)}
      </div>
    </div>
  );
};
export default QueueItem;

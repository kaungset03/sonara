import { Music, Play } from "lucide-react";
import { getFormattedDuration } from "@/lib/helpers";
import useAppStore from "@/store/app-store";

type SongCardProps = {
  song: Song;
  handleClick: (song: Song) => void;
};

const SongCard = ({ song, handleClick }: SongCardProps) => {
  const currentQueueItem = useAppStore((state) => state.currentQueueItem);
  const isCurrentPlayingSong =
    currentQueueItem && currentQueueItem.songId === song.id;
  return (
    <div
      className={`group flex items-center gap-3 px-3 py-2 rounded-xl border transition-colors
  ${
    isCurrentPlayingSong
      ? "bg-primary/10 border-primary/40"
      : "bg-card/50 border-border hover:bg-muted hover:border-primary/30"
  }`}
    >
      <div className="relative w-12 h-12 rounded-md bg-linear-to-br from-primary/30 to-primary/10 shrink-0 flex items-center justify-center overflow-hidden">
        <Music className="size-5 text-primary/50" />
        <button
          className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/50"
          onClick={() => handleClick(song)}
        >
          {!isCurrentPlayingSong && (
            <Play className="size-4 text-white opacity-0 transition-opacity group-hover:opacity-100 fill-white" />
          )}
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm truncate text-foreground">
          {song.title}
        </h3>
        <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
      </div>
      <div className="text-xs text-muted-foreground shrink-0">
        {getFormattedDuration(song.duration)}
      </div>
    </div>
  );
};
export default SongCard;

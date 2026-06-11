import {
  Heart,
  Pause,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import usePlayerStore from "@/store/store";

const AppFooter = () => {
  const currentSong = usePlayerStore((state) => state.currentSong);

  if (!currentSong) return null;

  return (
    <footer className="absolute bottom-0 left-0 right-0 w-full p-4 bg-muted">
      <section className="w-full h-full grid grid-cols-10 items-center">
        <div className="flex items-center justify-center gap-x-5 col-span-2">
          <SkipBack size={18} />
          <Pause size={18} />
          <SkipForward size={18} />
          <Shuffle size={18} />
          <Repeat size={18} />
        </div>
        <div className="col-span-5 w-full grid grid-cols-7 items-center justify-center">
          <span className="text-sm text-muted-foreground text-center">
            0:00
          </span>
          <div className="h-1 rounded-sm bg-muted-foreground col-span-5" />
          <span className="text-sm text-muted-foreground text-center">
            3:45
          </span>
        </div>
        <div className="flex items-center justify-center gap-x-5 col-span-1">
          <Heart size={18} />
          <Volume2 size={18} />
        </div>
        <div className="flex items-center justify-start gap-2 col-span-2">
          <div className="size-12 rounded-sm bg-primary" />
          <div>
            <h3 className="font-medium text-sm">{currentSong.title}</h3>
            <p className="text-xs text-muted-foreground">
              {currentSong.artist}
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
};
export default AppFooter;

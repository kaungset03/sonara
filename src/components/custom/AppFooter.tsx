import { Play, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import useCurrentSong from "@/hooks/useCurrentSong";
import AudioPlayer from "@/features/player/components/AudioPlayer";

const AppFooter = () => {
  const currentSong = useCurrentSong();

  if (currentSong) {
    return <AudioPlayer currentSong={currentSong} />;
  }

  return (
    <footer className="fixed bottom-2 left-2 right-2 rounded-3xl p-4 shadow-lg border border-secondary bg-muted dark:bg-sidebar/50 backdrop-blur-lg z-10">
      <section className="w-full h-full grid grid-cols-10 items-center opacity-60">
        <div className="flex items-center justify-center col-span-2 gap-x-2">
          <Button variant="ghost" size="icon" disabled>
            <SkipBack size={16} />
          </Button>
          <Button variant="ghost" size="icon" disabled>
            <Play size={16} />
          </Button>
          <Button variant="ghost" size="icon" disabled>
            <SkipForward size={16} />
          </Button>
        </div>

        <div className="col-span-5 px-4">
          <p className="text-center text-sm text-muted-foreground">
            Select a song to start listening
          </p>
        </div>

        <div className="col-span-1" />

        <div className="flex items-center gap-4 col-span-2">
          <div className="size-12 rounded-sm bg-muted-foreground/20" />
          <div>
            <p className="text-sm font-medium">No song selected</p>
          </div>
        </div>
      </section>
    </footer>
  );
};
export default AppFooter;

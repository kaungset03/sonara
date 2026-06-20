import {
  Heart,
  Music,
  Pause,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import PlaybackQueue from "@/features/queue/components/PlaybackQueue";
import SongTitle from "@/features/player/components/SongTitle";

// type AudioPlayerProps = {
//   currentSong: Song;
// };

const Player = () => {
  const currentSong = {
    id: "1",
    title: "Song Title",
    artist: "Artist Name",
    album: "Album Name",
    duration: 270, // Duration in seconds
  };
  return (
    <footer className="fixed bottom-2 left-2 right-2 rounded-3xl p-4 shadow-lg border border-muted-foreground/30 bg-muted/50 dark:bg-sidebar/50 backdrop-blur-md z-10">
      <section className="w-full h-full grid grid-cols-10 items-center">
        <div className="col-span-2 flex items-center justify-start gap-2 2xl:gap-4 min-w-0">
          <div className="size-12 rounded-md bg-linear-to-br from-primary/50 to-primary/30 shrink-0 flex items-center justify-center ">
            <Music className="size-5 text-primary" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <SongTitle text={currentSong.title} />
            <p className="text-xs text-muted-foreground">
              {currentSong.artist}
            </p>
          </div>
        </div>
        <div className="col-span-1 flex items-center justify-center gap-x-2 2xl:gap-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="border border-primary text-primary"
          >
            <Heart size={16} fill="currentColor" />
          </Button>
          <Button variant="ghost" size="icon" className="border border-primary">
            <Volume2 size={16} />
          </Button>
        </div>
        <div className="col-span-4 w-full grid grid-cols-10 items-center justify-center">
          <span className="text-sm font-heading font-medium text-muted-foreground text-center">
            2:15
          </span>
          <Slider
            defaultValue={[0]}
            max={270}
            value={[135]}
            onValueChange={(value) => {
              console.log("Seek to:", value[0]);
            }}
            className="col-span-8 w-full"
          />
          <span className="text-sm font-heading font-medium text-muted-foreground text-center">
            4:30
          </span>
        </div>
        <div className="col-span-2 flex items-center justify-center gap-x-2 2xl:gap-x-4">
          <Button variant="ghost" size="icon" className="border border-primary">
            <SkipBack size={16} />
          </Button>

          <Button variant="ghost" size="icon" className="border border-primary">
            <Pause size={16} />
          </Button>

          <Button variant="ghost" size="icon" className="border border-primary">
            <SkipForward size={16} />
          </Button>
          <Button size="icon" className="border border-primary">
            <Shuffle size={16} />
          </Button>
          <Button size="icon" className="border border-primary">
            <Repeat size={16} />
          </Button>
        </div>
        <div className="col-span-1 flex items-center justify-end">
          <PlaybackQueue />
        </div>
      </section>
    </footer>
  );
};
export default Player;

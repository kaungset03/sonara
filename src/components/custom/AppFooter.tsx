import {
  Heart,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { convertFileSrc } from "@tauri-apps/api/core";
import { useEffect, useRef, useState } from "react";
import usePlayerStore from "@/store/store";
import { Slider } from "../ui/slider";
import { getFormattedDuration } from "../../lib/helpers";

const AppFooter = () => {
  const playerRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = usePlayerStore((state) => state.currentSong);
  const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
  const queue = usePlayerStore((state) => state.queue);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);

  const [currentTime, setCurrentTime] = useState(0);

  const playAudio = () => {
    if (playerRef.current) {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (playerRef.current) {
      playerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((song) => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    const nextSong = queue[nextIndex];
    setCurrentSong(nextSong);
  };

  const handlePrevious = () => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((song) => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    const prevSong = queue[prevIndex];
    setCurrentSong(prevSong);
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleTimeUpdate = () => {
    if (playerRef.current) {
      setCurrentTime(playerRef.current.currentTime);
    }
  };

  useEffect(() => {
    const player = playerRef.current;
    if (player && currentSong) {
      player.src = convertFileSrc(currentSong.path);
      player.play();
      setIsPlaying(true);
    }
  }, [currentSong, setIsPlaying, playerRef]);

  if (!currentSong) {
    return null;
  }

  return (
    <footer className="absolute bottom-0 left-0 right-0 w-full p-4 bg-muted">
      <audio
        ref={playerRef}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onPlay={playAudio}
        onPause={pauseAudio}
      />
      <section className="w-full h-full grid grid-cols-10 items-center">
        <div className="flex items-center justify-center col-span-2 gap-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="border border-primary"
          >
            <SkipBack size={18} />
          </Button>
          {isPlaying ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={pauseAudio}
              className="border border-primary"
            >
              <Pause size={18} />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={playAudio}
              className="border border-primary"
            >
              <Play size={18} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="border border-primary"
          >
            <SkipForward size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="border border-primary">
            <Shuffle size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="border border-primary">
            <Repeat size={18} />
          </Button>
        </div>
        <div className="col-span-5 w-full grid grid-cols-7 items-center justify-center">
          <span className="text-sm text-muted-foreground text-center">
            {getFormattedDuration(currentTime)}
          </span>
          <Slider
            defaultValue={[0]}
            max={currentSong.duration}
            value={[currentTime]}
            onValueChange={(value) => {
              const newTime = value[0];
              if (playerRef.current) {
                playerRef.current.currentTime = newTime;
              }
            }}
            className="col-span-5 w-full"
          />
          <span className="text-sm text-muted-foreground text-center">
            {getFormattedDuration(currentSong.duration)}
          </span>
        </div>
        <div className="flex items-center justify-center gap-x-1 col-span-1">
          <Button variant="ghost" size="icon" className="border border-primary">
            <Heart size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="border border-primary">
            <Volume2 size={18} />
          </Button>
        </div>
        <div className="flex items-center justify-start gap-2 col-span-2">
          <div className="size-12 rounded-sm bg-primary" />
          <div>
            <h3 className="font-medium text-sm font-heading">
              {currentSong.title}
            </h3>
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

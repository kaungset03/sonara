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
import { convertFileSrc } from "@tauri-apps/api/core";
import { useEffect, useRef } from "react";
import usePlayerStore from "@/store/store";
import { Button } from "../ui/button";

const AppFooter = () => {
  const playerRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = usePlayerStore((state) => state.currentSong);
  const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
  const queue = usePlayerStore((state) => state.queue);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);

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
      <audio ref={playerRef} onEnded={handleEnded} />
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
            0:00
          </span>
          <div className="h-1 rounded-sm bg-muted-foreground col-span-5" />
          <span className="text-sm text-muted-foreground text-center">
            3:45
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
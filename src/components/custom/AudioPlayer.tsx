import {
  Heart,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { convertFileSrc } from "@tauri-apps/api/core";
import { useEffect, useRef, useState } from "react";
import { getFormattedDuration } from "@/lib/helpers";
import SongTitle from "@/components/custom/SongTitle";
import usePlayerStore from "@/store/store";
import useToggleFavoriteMutation from "@/features/favorites/useToggleFavoriteMutation";
import useMediaSession from "@/hooks/useMediaSession";

type AudioPlayerProps = {
  currentSong: Song;
};

const AudioPlayer = ({ currentSong }: AudioPlayerProps) => {
  const playerRef = useRef<HTMLAudioElement | null>(null);

  const setCurrentSongId = usePlayerStore((state) => state.setCurrentSongId);

  const queue = usePlayerStore((state) => state.queue);

  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);

  const muted = usePlayerStore((state) => state.muted);
  const setMuted = usePlayerStore((state) => state.setMuted);

  const [currentTime, setCurrentTime] = useState(0);

  const { mutate } = useToggleFavoriteMutation();

  const handleFavoriteToggle = () => {
    if (currentSong) {
      mutate({ songId: currentSong.id, isFavorite: !currentSong.is_favorite });
    }
  };

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
    setCurrentSongId(nextSong.id);
  };

  const handlePrevious = () => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((song) => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    const prevSong = queue[prevIndex];
    setCurrentSongId(prevSong.id);
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleTimeUpdate = () => {
    if (playerRef.current) {
      setCurrentTime(playerRef.current.currentTime);
    }
  };

  const handleSeek = (value: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime = value;
    }
  };

  const handleMuteToggle = () => {
    if (playerRef.current) {
      playerRef.current.muted = !playerRef.current.muted;
      setMuted(playerRef.current.muted);
    }
  };

  useMediaSession({
    song: currentSong!,
    position: currentTime,
    isPlaying,
    onPlay: playAudio,
    onPause: pauseAudio,
    onNext: handleNext,
    onPrevious: handlePrevious,
    onSeek: handleSeek,
  });

  useEffect(() => {
    const player = playerRef.current;
    if (player && currentSong) {
      player.src = convertFileSrc(currentSong.path);
      player.play();
      setIsPlaying(true);
    }
  }, [currentSong.id, setIsPlaying, playerRef]);

  return (
    <footer className="fixed bottom-2 left-2 right-2 rounded-3xl p-4 shadow-lg border border-secondary bg-muted dark:bg-sidebar/50 backdrop-blur-lg z-10">
      <section className="w-full h-full grid grid-cols-10 items-center">
        <audio
          ref={playerRef}
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          onPlay={playAudio}
          onPause={pauseAudio}
        />
        <div className="flex items-center justify-center col-span-2 gap-x-2 2xl:gap-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="border border-primary"
          >
            <SkipBack size={16} />
          </Button>
          {isPlaying ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={pauseAudio}
              className="border border-primary"
            >
              <Pause size={16} />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={playAudio}
              className="border border-primary"
            >
              <Play size={16} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="border border-primary"
          >
            <SkipForward size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="border border-primary">
            <Shuffle size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="border border-primary">
            <Repeat size={16} />
          </Button>
        </div>
        <div className="col-span-5 w-full grid grid-cols-10 items-center justify-center">
          <span className="text-sm font-heading font-medium text-muted-foreground text-center">
            {getFormattedDuration(currentTime)}
          </span>
          <Slider
            defaultValue={[0]}
            max={currentSong.duration}
            value={[currentTime]}
            onValueChange={(value) => {
              handleSeek(value[0]);
            }}
            className="col-span-8 w-full"
          />
          <span className="text-sm font-heading font-medium text-muted-foreground text-center">
            {getFormattedDuration(currentSong.duration)}
          </span>
        </div>
        <div className="flex items-center justify-center gap-x-2 2xl:gap-x-4 col-span-1">
          <Button
            variant="ghost"
            size="icon"
            className="border border-primary text-primary"
            onClick={handleFavoriteToggle}
          >
            {currentSong.is_favorite ? (
              <Heart size={16} fill="currentColor" />
            ) : (
              <Heart size={16} />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="border border-primary"
            onClick={handleMuteToggle}
          >
            {muted ? <VolumeOff size={16} /> : <Volume2 size={16} />}
          </Button>
        </div>
        <div className="flex items-center gap-2 2xl:gap-4 col-span-2 min-w-0">
          <div className="size-12 rounded-sm bg-primary shrink-0" />
          <div className="min-w-0 space-y-0.5">
            <SongTitle text={currentSong.title} />
            <p className="text-xs text-muted-foreground">
              {currentSong.artist}
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
};
export default AudioPlayer;

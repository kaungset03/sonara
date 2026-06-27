import {
  ChevronUp,
  Heart,
  Music,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { useEffect, useRef, useState } from "react";
import { getFormattedDuration } from "@/lib/helpers";
import useAppStore from "@/store/app-store";
import useToggleFavoriteMutation from "@/features/songs/api/useToggleFavoriteMutation";
import PlaybackQueue from "@/features/queue/components/PlaybackQueue";
import OverlayPlayer from "@/features/player/components/OverlayPlayer";
import useMediaSession from "@/hooks/useMediaSession";
import MarqueeText from "@/components/custom/MarqueText";

type AudioPlayerProps = {
  currentSong: Song;
};

const AudioPlayer = ({ currentSong }: AudioPlayerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const playerRef = useRef<HTMLAudioElement | null>(null);

  const hasCountedPlay = useRef(false);

  const next = useAppStore((state) => state.next);
  const previous = useAppStore((state) => state.previous);

  const isPlaying = useAppStore((state) => state.isPlaying);
  const setIsPlaying = useAppStore((state) => state.setIsPlaying);

  const isShuffle = useAppStore((state) => state.isShuffle);
  const setIsShuffle = useAppStore((state) => state.setIsShuffle);

  const muted = useAppStore((state) => state.muted);
  const setMuted = useAppStore((state) => state.setMuted);

  const repeatMode = useAppStore((state) => state.repeatMode);
  const toggleRepeatMode = useAppStore((state) => state.toggleRepeatMode);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { mutate } = useToggleFavoriteMutation();

  const collapse = () => {
    setIsExpanded(false);
  };

  const handleFavoriteToggle = () => {
    if (currentSong) {
      mutate({ songId: currentSong.id, isFavorite: !currentSong.is_favorite });
    }
  };

  const playAudio = () => {
    if (playerRef.current) {
      playerRef.current.play();
    }
  };

  const pauseAudio = () => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  };

  const handleNext = () => {
    next();
  };

  const handlePrevious = () => {
    previous();
  };

  const handleEnded = () => {
    if (repeatMode === "one") {
      if (playerRef.current) {
        playerRef.current.currentTime = 0;
        playerRef.current.play();
      }
    } else {
      next();
    }
  };

  const handleTimeUpdate = () => {
    if (playerRef.current) {
      setCurrentTime(playerRef.current.currentTime);
    }
  };

  const handleSeek = (value: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleOnLoadedMetadata = () => {
    if (playerRef.current) {
      setDuration(playerRef.current.duration);
      setCurrentTime(playerRef.current.currentTime);
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
    duration,
    isPlaying,
    onPlay: playAudio,
    onPause: pauseAudio,
    onNext: handleNext,
    onPrevious: handlePrevious,
    onSeek: handleSeek,
  });

  useEffect(() => {
    // disable scroll when overlay is expanded
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isExpanded]);

  useEffect(() => {
    hasCountedPlay.current = false;
  }, [currentSong.id]);

  useEffect(() => {
    if (!hasCountedPlay.current && duration > 0) {
      const playThreshold = Math.min(30, duration * 0.5);

      if (currentTime >= playThreshold) {
        hasCountedPlay.current = true;

        invoke("record_song_play", { songId: currentSong.id })
          .then(() =>
            console.log("Recorded song play for song ID:", currentSong.id),
          )
          .catch((err) => {
            console.error("Failed to record song play:", err);
          });
      }
    }
  }, [currentTime, duration, currentSong.id]);

  useEffect(() => {
    const player = playerRef.current;

    if (player) {
      player.src = convertFileSrc(currentSong.path);
      const playPromise = player.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Audio play failed:", err);
          }
        });
      }
    }
  }, [currentSong.id, setIsPlaying, playerRef]);

  return (
    <>
      <footer className="fixed bottom-2 left-2 right-2 rounded-3xl p-4 shadow-lg border border-muted-foreground/30 bg-muted/50 dark:bg-sidebar/50 backdrop-blur-md z-10">
        <audio
          ref={playerRef}
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleOnLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          muted={muted}
        />
        <section className="w-full h-full grid grid-cols-10 items-center">
          <div className="col-span-2 flex items-center justify-start gap-x-2 2xl:gap-x-4 min-w-0">
            <div className="size-12 rounded-md bg-linear-to-br from-primary/50 to-primary/30 shrink-0 flex items-center justify-center overflow-hidden">
              {currentSong.album_cover_path ? (
                <img
                  src={convertFileSrc(currentSong.album_cover_path)}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music className="size-5 text-primary" />
              )}
            </div>
            <div className="min-w-0 space-y-px">
              <MarqueeText
                text={currentSong.title}
                className="text-sm font-medium font-heading"
              />
              <MarqueeText
                text={`${currentSong.artist_name} - ${currentSong.album_name}`}
                className="text-xs text-muted-foreground"
              />
            </div>
          </div>
          <div className="col-span-1 flex items-center justify-center gap-x-2 2xl:gap-x-4">
            <Button variant="ghost" size="icon" onClick={handleFavoriteToggle}>
              {currentSong.is_favorite ? (
                <Heart className="text-primary" fill="currentColor" />
              ) : (
                <Heart />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleMuteToggle}>
              {muted ? <VolumeOff /> : <Volume2 />}
            </Button>
          </div>
          <div className="col-span-4 w-full grid grid-cols-10 items-center justify-center">
            <span className="text-sm font-heading font-medium text-muted-foreground text-center">
              {getFormattedDuration(currentTime)}
            </span>
            <Slider
              defaultValue={[0]}
              max={duration}
              value={[currentTime]}
              onValueChange={(value) => {
                handleSeek(value[0]);
              }}
              className="col-span-8 w-full"
            />
            <span className="text-sm font-heading font-medium text-muted-foreground text-center">
              {getFormattedDuration(duration)}
            </span>
          </div>
          <div className="col-span-2 flex items-center justify-center gap-x-2 2xl:gap-x-4">
            <Button
              variant={isShuffle ? "default" : "ghost"}
              size="icon"
              onClick={() => setIsShuffle(!isShuffle)}
            >
              <Shuffle />
            </Button>
            <Button variant="ghost" size="icon" onClick={handlePrevious}>
              <SkipBack />
            </Button>
            {isPlaying ? (
              <Button variant="ghost" size="icon" onClick={pauseAudio}>
                <Pause />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={playAudio}>
                <Play />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleNext}>
              <SkipForward />
            </Button>
            <Button
              variant={repeatMode !== "off" ? "default" : "ghost"}
              size="icon"
              onClick={toggleRepeatMode}
            >
              {repeatMode === "off" && <Repeat />}
              {repeatMode === "one" && <Repeat1 />}
              {repeatMode === "all" && <Repeat />}
            </Button>
          </div>
          <div className="col-span-1 flex items-center justify-end gap-x-2 2xl:gap-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(true)}
            >
              <ChevronUp />
            </Button>
            <PlaybackQueue />
          </div>
        </section>
      </footer>

      <OverlayPlayer
        isExpanded={isExpanded}
        collapse={collapse}
        song={currentSong}
        position={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        onPlay={playAudio}
        onPause={pauseAudio}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={handleSeek}
        toggleFavorite={handleFavoriteToggle}
      />
    </>
  );
};
export default AudioPlayer;

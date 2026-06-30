import { convertFileSrc } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
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
import { Slider } from "@/components/ui/slider";
import { getFormattedDuration } from "@/lib/helpers";
import SongLyrics from "@/features/lyrics/components/SongLyrics";
import useAppStore from "@/store/app-store";
import UpdateSongLyricsButton from "@/features/lyrics/components/UpdateSongLyricsButton";
import PlaybackQueue from "@/features/queue/components/PlaybackQueue";

type OverlayPlayerProps = {
  isExpanded: boolean;
  collapse: () => void;
  song: Song;
  position: number;
  duration: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (value: number) => void;
  toggleFavorite: () => void;
};
const OverlayPlayer = ({
  isExpanded,
  collapse,
  song,
  position,
  duration,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  toggleFavorite,
}: OverlayPlayerProps) => {
  const isShuffle = useAppStore((state) => state.isShuffle);
  const setIsShuffle = useAppStore((state) => state.setIsShuffle);

  const repeatMode = useAppStore((state) => state.repeatMode);
  const toggleRepeatMode = useAppStore((state) => state.toggleRepeatMode);

  const muted = useAppStore((state) => state.muted);
  const setMuted = useAppStore((state) => state.setMuted);

  return (
    <section className="fixed inset-0 z-50 pointer-events-none ">
      <div
        className={`absolute inset-0 bg-background transition-opacity duration-350 ease-in ${isExpanded ? "opacity-100" : "opacity-0"}`}
        onClick={collapse}
      />
      <div
        className={`absolute top-0 left-0 w-full h-full  ${isExpanded ? "translate-y-0" : "translate-y-full"} transition-transform duration-350 ease-in pointer-events-auto`}
      >
        <div
          className="w-full h-16 flex items-center justify-end py-2 px-4"
          data-tauri-drag-region
        >
          <div className="flex items-center gap-x-4">
            <Button variant="ghost" size="icon" onClick={collapse}>
              <ChevronDown />
            </Button>
            <PlaybackQueue />
          </div>
        </div>
        <div className="w-full h-[calc(100%-64px)] grid grid-cols-4 ">
          <div className="col-span-2 w-full h-full p-4 flex flex-col justify-center items-center gap-y-6">
            <div className="size-70 rounded-xl bg-linear-to-br from-primary/30 to-primary/10 flex items-center justify-center overflow-hidden">
              {song.album_cover_path ? (
                <img
                  src={convertFileSrc(song.album_cover_path)}
                  alt={song.title}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <Music className="size-22 text-primary" />
              )}
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-semibold leading-tight font-heading truncate">
                {song.title}
              </h3>

              <div className="flex flex-col items-center gap-0.5">
                <p className="text-sm text-muted-foreground font-medium truncate">
                  {song.artist_name}
                </p>

                <p className="text-xs text-muted-foreground/70 truncate">
                  {song.album_name}
                </p>
              </div>
            </div>
            <div className="space-y-6 mt-4">
              {/** Playback Buttons */}
              <div className="flex items-center justify-center gap-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={toggleFavorite}
                >
                  {song.is_favorite ? (
                    <Heart className="text-primary" fill="currentColor" />
                  ) : (
                    <Heart />
                  )}
                </Button>

                <Button
                  variant={isShuffle ? "default" : "ghost"}
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsShuffle(!isShuffle)}
                >
                  <Shuffle />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={onPrevious}
                >
                  <SkipBack />
                </Button>
                <Button
                  size="icon-lg"
                  className="rounded-full"
                  onClick={isPlaying ? onPause : onPlay}
                >
                  {isPlaying ? <Pause /> : <Play />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={onNext}
                >
                  <SkipForward />
                </Button>
                <Button
                  variant={repeatMode !== "off" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-full"
                  onClick={toggleRepeatMode}
                >
                  {repeatMode === "off" && <Repeat />}
                  {repeatMode === "one" && <Repeat1 />}
                  {repeatMode === "all" && <Repeat />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setMuted(!muted)}
                >
                  {muted ? <VolumeOff /> : <Volume2 />}
                </Button>
              </div>
              <div className="w-full space-y-2">
                <Slider
                  defaultValue={[0]}
                  max={duration}
                  value={[position]}
                  onValueChange={(value) => {
                    onSeek(value[0]);
                  }}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>{getFormattedDuration(position)}</span>
                  <span>{getFormattedDuration(duration)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2 w-full h-full p-4 flex flex-col justify-center items-center gap-y-8">
            <SongLyrics songId={song.id} audioCurrentTime={position} />
            <UpdateSongLyricsButton songId={song.id} />
          </div>
        </div>
      </div>
    </section>
  );
};
export default OverlayPlayer;

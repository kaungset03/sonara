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
import SongLyrics from "@/features/player/components/SongLyrics";
import useAppStore from "@/store/app-store";
import UpdateSongLyricsButton from "@/features/player/components/UpdateSongLyricsButton";
import PlaybackQueue from "@/features/queue/components/PlaybackQueue";
import WindowControlButtons from "@/components/custom/WindowControlButtons";

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
    <section className="fixed inset-0 z-50 pointer-events-none rounded-3xl">
      <div
        className={`absolute rounded-3xl inset-0 bg-background backdrop-blur-md transition-opacity duration-350 ease-in ${isExpanded ? "opacity-100" : "opacity-0"}`}
        onClick={collapse}
      />
      <div
        className={`absolute top-0 left-0 w-full h-full  ${isExpanded ? "translate-y-0" : "translate-y-full"} transition-transform duration-350 ease-in pointer-events-auto`}
      >
        {/** Header */}
        <div className="w-full h-16 flex items-center justify-between p-2 border-b border-muted">
          <WindowControlButtons />
          <div className="flex items-center gap-x-4 pr-4">
            <Button variant="ghost" size="icon" onClick={collapse}>
              <ChevronDown />
            </Button>
            <PlaybackQueue />
          </div>
        </div>
        <div className="w-full h-[calc(100%-64px)] grid grid-cols-4 ">
          <div className="col-span-2 w-full h-full p-4 flex flex-col justify-center items-center gap-y-6">
            <div className="size-60 rounded-2xl bg-linear-to-br from-primary/30 to-primary/10 flex items-center justify-center overflow-hidden">
              <Music className="size-22 text-primary" />
            </div>
            <div className="space-y-1 text-center font-heading">
              <h3 className="font-semibold">{song.title}</h3>
              <p className="text-muted-foreground text-sm">{song.artist}</p>
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
            {song.lyrics_path ? (
              <SongLyrics audioCurrentTime={position} path={song.lyrics_path} />
            ) : (
              <div className="h-85 w-full flex justify-center items-center text-center">
                <p className="font-heading font-medium text-muted-foreground mb-4">
                  No lyrics available for this song. <br /> You can add lyrics
                  by clicking the button below.
                </p>
              </div>
            )}
            <UpdateSongLyricsButton songId={song.id} />
          </div>
        </div>
      </div>
    </section>
  );
};
export default OverlayPlayer;

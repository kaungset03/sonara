import { useEffect } from "react";

type useMediaSessionProps = {
  song: Song;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

const useMediaSession = ({
  song,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
}: useMediaSessionProps) => {
  useEffect(() => {
    if ("mediaSession" in navigator && song) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title || "Unknown Title",
        artist: song.artist || "Unknown Artist",
        album: song.album || "Unknown Album",
      });
    }
  }, [song]);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
    }
  }, [isPlaying]);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      // Safely assign handlers only if the callback is provided
      if (onPlay) navigator.mediaSession.setActionHandler("play", onPlay);
      if (onPause) navigator.mediaSession.setActionHandler("pause", onPause);
      if (onNext) navigator.mediaSession.setActionHandler("nexttrack", onNext);
      if (onPrevious)
        navigator.mediaSession.setActionHandler("previoustrack", onPrevious);

      return () => {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
      };
    }
  }, [onPlay, onPause, onNext, onPrevious]);
};

export default useMediaSession;

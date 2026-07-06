import { convertFileSrc } from "@tauri-apps/api/core";
import { useEffect } from "react";

type useMediaSessionProps = {
  song: Song;
  position: number;
  duration: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (position: number) => void;
};

const useMediaSession = ({
  song,
  position,
  duration,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
}: useMediaSessionProps) => {
  const artworkPath = song?.album_cover_path
    ? convertFileSrc(song.album_cover_path)
    : "/128x128@2x.png";

  useEffect(() => {
    if ("mediaSession" in navigator && song) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title || "Unknown Title",
        artist: song.artist_name || "Unknown Artist",
        album: song.album_name || "Unknown Album",
        // artwork: [
        //   {
        //     src: artworkPath,
        //     sizes: "256x256",
        //     type: "image/png",
        //   },
        // ],
      });
    }
  }, [song]);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
    }
  }, [isPlaying]);

  // Sync OS Progress Bar (Position and Duration)
  useEffect(() => {
    if ("mediaSession" in navigator && duration > 0) {
      try {
        navigator.mediaSession.setPositionState({
          duration: duration,
          playbackRate: 1,
          position: position,
        });
      } catch (e) {
        console.warn("Could not set OS position state:", e);
      }
    }
  }, [duration, isPlaying]);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      // Safely assign handlers only if the callback is provided
      if (onPlay) navigator.mediaSession.setActionHandler("play", onPlay);
      if (onPause) navigator.mediaSession.setActionHandler("pause", onPause);
      if (onNext) navigator.mediaSession.setActionHandler("nexttrack", onNext);
      if (onPrevious)
        navigator.mediaSession.setActionHandler("previoustrack", onPrevious);

      if (onSeek) {
        navigator.mediaSession.setActionHandler("seekto", (details) => {
          // details.seekTime is the exact second the user dragged the OS slider to
          if (details.seekTime !== undefined) {
            onSeek(details.seekTime);
          }
        });
      }

      return () => {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
        navigator.mediaSession.setActionHandler("seekto", null);
      };
    }
  }, [onPlay, onPause, onNext, onPrevious, onSeek]);
};

export default useMediaSession;

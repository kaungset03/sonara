import { RefObject } from "react";

type AudioPlayerProps = {
  playerRef: RefObject<HTMLAudioElement | null>;
};

const AudioPlayer = ({ playerRef }: AudioPlayerProps) => {
  return <audio ref={playerRef} />;
};
export default AudioPlayer;

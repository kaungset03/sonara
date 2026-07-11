import RenderLyricsView from "@/features/lyrics/components/RenderLyricsView";
import { Button } from "../../../components/ui/button";
import { RotateCw } from "lucide-react";

type SongLyricsProps = {
  isFetching: boolean;
  audioCurrentTime: number;
  lyricsContent: string | undefined;
  handleRefetchLyrics: () => void;
};

const SongLyrics = ({
  isFetching,
  audioCurrentTime,
  lyricsContent,
  handleRefetchLyrics,
}: SongLyricsProps) => {
  if (isFetching) {
    return (
      <div className="h-90 w-full flex justify-center items-center text-center">
        <p className="font-heading font-medium text-muted-foreground mb-4">
          Searching for lyrics...
        </p>
      </div>
    );
  }

  if (lyricsContent) {
    return (
      <RenderLyricsView
        content={lyricsContent}
        audioCurrentTime={audioCurrentTime}
      />
    );
  }

  return (
    <div className="h-90 w-full flex flex-col justify-center items-center text-center">
      <p className="font-heading font-medium text-muted-foreground mb-4">
        Sorry, we couldn't find any lyrics for this song. <br />
        You can add your own lyrics or try searching again.
      </p>
      <Button variant="outline" size="icon" onClick={handleRefetchLyrics}>
        <RotateCw />
      </Button>
    </div>
  );
};
export default SongLyrics;

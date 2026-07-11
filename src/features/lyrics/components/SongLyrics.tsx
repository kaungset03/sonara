import RenderLyricsView from "@/features/lyrics/components/RenderLyricsView";

type SongLyricsProps = {
  isFetching: boolean;
  audioCurrentTime: number;
  lyricsContent: string | undefined;
};

const SongLyrics = ({
  isFetching,
  audioCurrentTime,
  lyricsContent,
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
    <div className="h-90 w-full flex justify-center items-center text-center">
      <p className="font-heading font-medium text-muted-foreground mb-4">
        No lyrics available for this song. <br /> You can add your own lyrics by
        clicking the button below.
      </p>
    </div>
  );
};
export default SongLyrics;

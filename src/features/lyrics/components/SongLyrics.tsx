import useGetSongLyricsQuery from "@/features/lyrics/api/useGetSongLyricsQuery";
import RenderLyricsView from "@/features/lyrics/components/RenderLyricsView";

type SongLyricsProps = {
  songId: number;
  audioCurrentTime: number;
};

const SongLyrics = ({ songId, audioCurrentTime }: SongLyricsProps) => {
  const { data: lyricsPath, isLoading, isPending } = useGetSongLyricsQuery({ songId });

  if (isLoading || isPending) {
    return (
      <div className="h-90 w-full flex justify-center items-center text-center">
        <p className="font-heading font-medium text-muted-foreground mb-4">
          Searching for lyrics...
        </p>
      </div>
    );
  }

  if (lyricsPath) {
    return (
      <RenderLyricsView path={lyricsPath} audioCurrentTime={audioCurrentTime} />
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

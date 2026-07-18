import useGetSongLyricsQuery from "@/features/lyrics/api/useGetSongLyricsQuery";
import SongLyrics from "@/features/lyrics/components/SongLyrics";
import UpdateSongLyrics from "@/features/lyrics/components/UpdateSongLyrics";

type LyricsSectionProps = {
  song: Song;
  position: number;
};

const LyricsSection = ({ song, position }: LyricsSectionProps) => {
  const {
    data: lyricsContent,
    refetch,
    isFetching,
    isRefetching,
  } = useGetSongLyricsQuery({ songId: song.id });

  const isLoading = isFetching || isRefetching;
  const handleRefetchLyrics = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center text-center">
        <p className="font-heading font-medium text-muted-foreground mb-4">
          Searching for lyrics...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 flex flex-col justify-center items-center gap-y-8">
      <SongLyrics
        audioCurrentTime={position}
        lyricsContent={lyricsContent}
        handleRefetchLyrics={handleRefetchLyrics}
      />

      <UpdateSongLyrics
        song_id={song.id}
        description={`${song.title} - ${song.artist_name}`}
        initialContent={lyricsContent || ""}
      />
    </div>
  );
};

export default LyricsSection;

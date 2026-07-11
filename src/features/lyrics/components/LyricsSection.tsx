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

  const handleRefetchLyrics = () => {
    refetch();
  };

  return (
    <div className="w-full h-full p-4 flex flex-col justify-center items-center gap-y-8">
      <SongLyrics
        isFetching={isFetching || isRefetching}
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

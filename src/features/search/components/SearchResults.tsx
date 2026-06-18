import { Music } from "lucide-react";

type SearchResultProps = {
  title: "SONGS" | "ARTISTS" | "ALBUMS";
};

const results = [
  {
    id: "1",
    title: "Song Title 1",
    artist: "Artist Name",
    album: "Album Name",
  },
  {
    id: "2",
    title: "Song Title 2",
    artist: "Artist Name",
    album: "Album Name",
  },
  {
    id: "3",
    title: "Song Title 3",
    artist: "Artist Name",
    album: "Album Name",
  },
  {
    id: "4",
    title: "Song Title 4",
    artist: "Artist Name",
    album: "Album Name",
  },
  {
    id: "5",
    title: "Song Title 5",
    artist: "Artist Name",
    album: "Album Name",
  },
];

const SearchResults = ({ title }: SearchResultProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase text-muted-foreground">
        {title} (5)
      </h3>
      <div className="space-y-1">
        {results.map((song) => (
          <button
            key={song.id}
            className="w-full rounded-lg p-3 text-left transition-colors hover:bg-muted"
          >
            <div className="flex items-start gap-3">
              <div className="size-8 flex items-center justify-center">
                <Music size={20} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-foreground">
                  {song.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {song.artist} • {song.album}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
export default SearchResults;

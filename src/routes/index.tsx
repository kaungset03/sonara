import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Album,
  BarChart3,
  Flame,
  Heart,
  Music,
  Play,
  Sparkle,
  User,
} from "lucide-react";
import SongCard from "@/features/home/components/SongCard";
import StatsCard from "@/features/home/components/StatsCard";
import useGetHomeDataQuery from "@/features/home/api/useGetHomeDataQuery";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data } = useGetHomeDataQuery();

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {data.recently_played_songs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Play size={18} className="text-primary" />
              Continue Listening
            </h2>
          </div>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {data.recently_played_songs.slice(0, 4).map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" />
            Browse Library
          </h2>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Link to={"/songs"} className="w-full">
            <StatsCard
              icon={<Music size={20} />}
              label="Songs"
              value={data.stats.total_songs}
            />
          </Link>
          <Link to={"/artists"} className="w-full">
            <StatsCard
              icon={<User size={20} />}
              label="Artists"
              value={data.stats.total_artists}
            />
          </Link>
          <Link to={"/albums"} className="w-full">
            <StatsCard
              icon={<Album size={20} />}
              label="Albums"
              value={data.stats.total_albums}
            />
          </Link>
          <Link to={"/favorites"} className="w-full">
            <StatsCard
              icon={<Heart size={20} />}
              label="Favorites"
              value={data.stats.total_favorites}
            />
          </Link>
        </div>
      </section>

      {data.most_played_songs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Flame size={18} className="text-primary" />
              Most Played
            </h2>
            <Link
              to={"/songs"}
              className="text-xs text-foreground underline hover:text-primary"
            >
              View All
            </Link>
          </div>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {data.most_played_songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
      )}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkle size={18} className="text-primary" />
            Recently Added
          </h2>
          <Link
            to={"/songs"}
            className="text-xs text-foreground underline hover:text-primary"
          >
            View All
          </Link>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {data.recently_added_songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>
    </div>
  );
}

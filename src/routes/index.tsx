import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Album,
  BarChart3,
  Flame,
  Heart,
  Play,
  Sparkle,
  User,
} from "lucide-react";
import SongCard from "@/features/home/components/SongCard";
import StatsCard from "@/features/home/components/StatsCard";

export const Route = createFileRoute("/")({
  component: Index,
});

const recentlyPlayedSongs = [
  {
    id: "1",
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "Divide",
    duration: 233,
  },
  {
    id: "2",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 200,
  },
  {
    id: "3",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: 203,
  },
  {
    id: "4",
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    duration: 174,
  },
];

function Index() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Play size={18} className="text-primary" />
            Continue Listening
          </h2>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {recentlyPlayedSongs.slice(0, 4).map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" />
            Browse Library
          </h2>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={<BarChart3 size={20} />}
            label="Songs"
            value={25}
            href="#"
          />
          <StatsCard
            icon={<User size={20} />}
            label="Artists"
            value="15"
            href="#"
          />
          <StatsCard
            icon={<Album size={20} />}
            label="Albums"
            value="10"
            href="#"
          />
          <StatsCard
            icon={<Heart size={20} />}
            label="Favorites"
            value="10"
            href="#"
          />
        </div>
      </section>
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
          {recentlyPlayedSongs.slice(0, 4).map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
          {recentlyPlayedSongs.slice(0, 4).map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>
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
          {recentlyPlayedSongs.slice(0, 4).map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
          {recentlyPlayedSongs.slice(0, 4).map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>
    </div>
  );
}

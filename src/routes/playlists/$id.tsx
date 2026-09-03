import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Play, Shuffle } from "lucide-react";
import { getFormattedDuration } from "@/lib/helpers";
import useAppStore from "@/store/app-store";
import EditPlaylistDialog from "@/features/playlists/components/EditPlaylistDialog";
import DeletePlaylistAlert from "@/features/playlists/components/DeletePlaylistAlert";
import SongsTable from "@/features/songs/components/SongsTable";
import AddSongsToPlaylistDialog from "@/features/playlists/components/AddSongsToPlaylistDialog";
import useGetSongsByPlaylistQuery from "@/features/playlists/api/useGetSongsByPlaylistQuery";
import useRemoveSongFromPlaylistMutation from "@/features/playlists/api/useRemoveSongFromPlaylistMutation";

export const Route = createFileRoute("/playlists/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data } = useGetSongsByPlaylistQuery(Number(id));
  const songs = data?.songs;
  const totalDuration =
    songs?.reduce((total, song) => total + song.duration, 0) ?? 0;

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: songs?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 8,
    getItemKey: (index) => songs?.[index].id ?? index,
  });

  const { mutate } = useRemoveSongFromPlaylistMutation();

  const playSong = useAppStore((state) => state.playSong);
  const isShuffle = useAppStore((state) => state.isShuffle);
  const setIsShuffle = useAppStore((state) => state.setIsShuffle);

  const handleSongClick = (song: Song) => {
    if (songs) {
      playSong(song, songs);
    }
  };

  const handlePlayAll = () => {
    if (songs) {
      playSong(songs[0], songs);
    }
  };

  const handleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const handleRemoveFromPlaylist = (songId: number) => {
    mutate({ songIds: [songId], playlistId: Number(id) });
  };

  if (songs) {
    const virtualRows = rowVirtualizer.getVirtualItems();
    const visibleSongs = virtualRows.map((row) => songs[row.index]);
    return (
      <main
        ref={parentRef}
        className="p-2 pt-18 pb-25 w-full h-screen space-y-6 overflow-y-auto custom-scrollbar"
      >
        <div className="flex flex-col gap-6 mb-8 border-b border-muted-foreground/30 pb-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold font-heading tracking-tight">
              {data?.playlist.name}
            </h1>
            <div className="flex items-center gap-2">
              <EditPlaylistDialog playlist={data?.playlist} />
              <DeletePlaylistAlert playlistId={Number(id)} />
            </div>

            <p className="text-muted-foreground mt-1">
              {songs.length} {songs.length === 1 ? "Song" : "Songs"} -{" "}
              {getFormattedDuration(totalDuration)}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={handlePlayAll} className="gap-2 text-xs">
              <Play size={16} fill="currentColor" />
              Play All
            </Button>
            <Button
              onClick={handleShuffle}
              variant={isShuffle ? "default" : "outline"}
              className="gap-2 text-xs border border-muted-foreground/30"
            >
              <Shuffle size={16} />
              Shuffle
            </Button>
            <AddSongsToPlaylistDialog playlistId={Number(id)} />
          </div>
        </div>

        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {visibleSongs.length === 0 ? (
            <div className="absolute inset-0 top-8 flex flex-col items-center justify-center gap-4 h-full">
              <p className="text-muted-foreground text-sm">
                No songs in this playlist yet.
              </p>
              <AddSongsToPlaylistDialog playlistId={Number(id)} />
            </div>
          ) : (
            <div
              style={{
                position: "absolute",
                width: "100%",
                transform: `translateY(${virtualRows[0]?.start ?? 0}px)`,
              }}
            >
              <SongsTable
                songs={visibleSongs}
                handleSongClick={handleSongClick}
                renderActions={(song) => (
                  <DropdownMenuItem
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromPlaylist(song.id);
                    }}
                  >
                    Remove from Playlist
                  </DropdownMenuItem>
                )}
              />
            </div>
          )}
        </div>
      </main>
    );
  }
}

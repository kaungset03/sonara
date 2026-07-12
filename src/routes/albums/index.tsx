import { convertFileSrc } from "@tauri-apps/api/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import useGetAllAlbumsQuery from "@/features/albums/api/useGetAllAlbumsQuery";
import SortBySelect from "@/components/custom/SortBySelect";
import useAppStore from "@/store/app-store";
import EmptySongAlert from "@/components/custom/EmptySongAlert";
import Loading from "@/components/custom/Loading";

export const Route = createFileRoute("/albums/")({
  component: RouteComponent,
});

function RouteComponent() {
  const sortValue = useAppStore((state) => state.albumSortValue);
  const setSortValue = useAppStore((state) => state.setAlbumSortValue);
  const { data: albums } = useGetAllAlbumsQuery({
    value: sortValue,
  });

  if (!albums) {
    return <Loading />;
  }

  if (albums.length <= 0) {
    return <EmptySongAlert />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold font-heading">Albums</h1>
        <SortBySelect value={sortValue} onValueChange={setSortValue} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
        {albums?.map((album) => {
          const initials = album.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

          return (
            <Link
              to={"/albums/$id"}
              params={{ id: album.id.toString() }}
              key={album.id}
              className="group flex flex-col gap-1"
            >
              <div className="relative w-full aspect-square shrink-0 bg-linear-to-br from-primary/30 to-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                {album.cover_path ? (
                  <img
                    src={convertFileSrc(album.cover_path)}
                    alt={album.name}
                    className="w-full h-full object-cover object-center scale-110 group-hover:scale-100 transition-transform ease-in-out duration-350"
                  />
                ) : (
                  <span className="text-4xl font-bold text-muted-foreground">
                    {initials}
                  </span>
                )}
              </div>

              <div className="space-y-1 flex-1">
                <h3 className="font-semibold group-hover:text-primary transition-colors text-ellipsis overflow-hidden whitespace-nowrap ">
                  {album.name}
                </h3>
                <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors text-ellipsis overflow-hidden whitespace-nowrap ">
                  {album.artist_name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

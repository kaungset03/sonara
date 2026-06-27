import { convertFileSrc } from "@tauri-apps/api/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import useGetAllArtistsQuery from "@/features/artists/api/useGetAllArtistsQuery";

export const Route = createFileRoute("/artists/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: artists } = useGetAllArtistsQuery();

  return (
    <div>
      <h1 className="text-3xl font-bold font-heading mb-4">Artists</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {artists?.map((artist) => {
          const initials = artist.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

          return (
            <Link
              to={"/artists/$id"}
              params={{ id: artist.id.toString() }}
              key={artist.id}
              className="group flex flex-col justify-center items-center gap-4 rounded-lg p-4 hover:bg-primary/20 ease-in-out duration-300 transition-colors"
            >
              <div className="relative w-4/5 aspect-square rounded-full shrink-0 bg-linear-to-br from-primary/30 to-primary/10 flex items-center justify-center overflow-hidden">
                {artist.image_path ? (
                  <img
                    src={convertFileSrc(artist.image_path)}
                    alt={artist.name}
                    className="size-full rounded-full object-cover object-center"
                  />
                ) : (
                  <span className="text-2xl font-bold text-muted-foreground">
                    {initials}
                  </span>
                )}
              </div>

              <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                {artist.name}
              </h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

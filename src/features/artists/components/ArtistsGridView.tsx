import { Link } from "@tanstack/react-router";
import { convertFileSrc } from "@tauri-apps/api/core";

type ArtistsGridViewProps = {
  artists: Array<Artist>;
};
const ArtistsGridView = ({ artists }: ArtistsGridViewProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
      {artists.map((artist) => {
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
            className="group flex flex-col justify-center items-center gap-y-4 p-2"
          >
            <div className="relative w-full aspect-square rounded-full shrink-0 bg-linear-to-br from-primary/30 to-primary/10 flex items-center justify-center overflow-hidden">
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

            <h3 className="font-semibold group-hover:text-primary transition-colors text-ellipsis overflow-hidden whitespace-nowrap w-full text-center">
              {artist.name}
            </h3>
          </Link>
        );
      })}
    </div>
  );
};
export default ArtistsGridView;

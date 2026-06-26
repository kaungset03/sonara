import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useGetAllAlbumsQuery from "@/features/albums/api/useGetAllAlbumsQuery";

export const Route = createFileRoute("/albums/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: albums } = useGetAllAlbumsQuery();
  return (
    <div>
      <h1 className="text-3xl font-bold font-heading mb-4">Albums</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
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
            >
              <Card className="group cursor-pointer">
                <CardContent className="flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 mb-3 shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                    <AvatarFallback className="text-2xl font-bold bg-muted border">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <h3
                    className="font-semibold w-full truncate leading-tight"
                    title={album.name}
                  >
                    {album.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {album.artist_id}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

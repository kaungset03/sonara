import { createFileRoute } from "@tanstack/react-router";
import useGetAllArtistsQuery from "@/features/artists/api/useGetAllArtistsQuery";
import SortBySelect from "@/components/custom/SortBySelect";
import useAppStore from "@/store/app-store";
import EmptySongAlert from "@/components/custom/EmptySongAlert";
import ArtistsGridView from "@/features/artists/components/ArtistsGridView";
import Loading from "@/components/custom/Loading";

export const Route = createFileRoute("/artists/")({
  component: RouteComponent,
});

function RouteComponent() {
  const sortValue = useAppStore((state) => state.artistSortValue);
  const setSortValue = useAppStore((state) => state.setArtistSortValue);
  const { data: artists, isLoading } = useGetAllArtistsQuery({
    value: sortValue,
  });

  if (!artists || isLoading) {
    return <Loading />;
  }

  if (artists.length > 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold font-heading">Artists</h1>
          <SortBySelect value={sortValue} onValueChange={setSortValue} />
        </div>

        <ArtistsGridView artists={artists} />
      </div>
    );
  }

  return <EmptySongAlert />;
}

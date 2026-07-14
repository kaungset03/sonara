import { createFileRoute } from "@tanstack/react-router";
import useGetAllAlbumsQuery from "@/features/albums/api/useGetAllAlbumsQuery";
import SortBySelect from "@/components/custom/SortBySelect";
import useAppStore from "@/store/app-store";
import EmptySongAlert from "@/components/custom/EmptySongAlert";
import AlbumsGridView from "@/features/albums/components/AlbumsGridView";

export const Route = createFileRoute("/albums/")({
  component: RouteComponent,
});

function RouteComponent() {
  const sortValue = useAppStore((state) => state.albumSortValue);
  const setSortValue = useAppStore((state) => state.setAlbumSortValue);
  const { data: albums } = useGetAllAlbumsQuery({
    value: sortValue,
  });

  if (albums && albums.length > 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold font-heading">Albums</h1>
          <SortBySelect value={sortValue} onValueChange={setSortValue} />
        </div>
        <AlbumsGridView albums={albums} />
      </div>
    );
  }

  return <EmptySongAlert />;
}

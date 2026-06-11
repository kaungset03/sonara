import { createFileRoute } from "@tanstack/react-router";
import SongsTable from "@/components/custom/SongsTable";

export const Route = createFileRoute("/songs/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SongsTable />
    </div>
  );
}

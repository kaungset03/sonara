import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const handleGetAllSongs = async () => {
    const songs = await invoke("get_all_songs");
    console.log(songs);
  };

  return (
    <div>
      <h3>Welcome Home!</h3>
      <Button onClick={handleGetAllSongs}>Get All Songs</Button>
    </div>
  );
}

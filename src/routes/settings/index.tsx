import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/custom/ThemeProvider";

export const Route = createFileRoute("/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { setTheme } = useTheme();
  return (
    <div className="flex flex-col gap-4">
      <Button variant={"ghost"} onClick={() => setTheme("dark")}>Dark Mode</Button>
      <Button variant={"ghost"} onClick={() => setTheme("light")}>Light Mode</Button>
      <Button variant={"ghost"} onClick={() => setTheme("system")}>System Default</Button>
    </div>
  );
}

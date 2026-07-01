import { useRef } from "react";
import { ChevronLeft } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { platform } from "@tauri-apps/plugin-os";
import { Button } from "@/components/ui/button";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import SearchDialog from "@/features/search/components/SearchDialog";
import ImportButton from "@/features/import/components/ImportButton";

const AppHeader = () => {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const containerRef = useRef<HTMLDivElement>(null);
  const appWindow = getCurrentWindow();

  const handleBack = () => {
    if (canGoBack) {
      router.history.back();
    } else {
      router.navigate({ to: "/" }); 
    }
  };

  const currentPlatform = platform();
  const isMacOS = currentPlatform === "macos";

  const handler = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.buttons === 1) {
      e.detail === 2
        ? await appWindow.toggleMaximize()
        : await appWindow.startDragging();
    }
  };

  return (
    <header
      ref={containerRef}
      onMouseDown={isMacOS ? handler : undefined}
      data-tauri-drag-region={isMacOS}
      className="h-14 p-2 fixed top-2 right-2 left-64 rounded-3xl shadow-md border border-muted-foreground/30 bg-muted/50 dark:bg-sidebar/50 backdrop-blur-lg z-10 flex items-center justify-between"
    >
      <div className="flex items-center gap-3 flex-1">
        <Button
          variant="outline"
          className="border border-muted-foreground/30"
          size="icon"
          onClick={handleBack}
        >
          <ChevronLeft />
        </Button>
        <SearchDialog />
      </div>
      <ImportButton />
    </header>
  );
};
export default AppHeader;

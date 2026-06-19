import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import SearchDialog from "@/features/search/components/SearchDialog";

const AppHeader = () => {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  const handleBack = () => {
    if (canGoBack) {
      router.history.back();
    } else {
      router.navigate({ to: "/" }); // Fallback to home if no app history
    }
  };

  const handleFolderSelection = async () => {
    // Implementation for folder selection
    const path = await open({
      multiple: false,
      directory: true,
    });
    if (path) {
      console.log("Selected folder:", path);
      // Here you would typically send the selected path to your backend or state management
      const result = await invoke("add_library_folder", { path });
      console.log("Result:", result);
    }
  };

  return (
    <header className="h-16 m-2 p-2 sticky top-2 rounded-3xl shadow-md border border-muted-foreground/30 bg-muted/50 dark:bg-sidebar/50 backdrop-blur-lg z-10 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <Button variant="outline" className="border border-secondary-foreground/30" size="icon" onClick={handleBack}>
          <ChevronLeft />
        </Button>
        <SearchDialog />
      </div>
      <Button
        variant="outline"
        className="border border-secondary-foreground/30"
        onClick={handleFolderSelection}
      >
        <Plus size={16} />
        <span className="text-xs font-heading text-foreground">
          Scan Folder
        </span>
      </Button>
    </header>
  );
};
export default AppHeader;

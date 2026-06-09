import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

const AppHeader = () => {
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
    <header className="h-16 flex items-center justify-between px-4">
      <div className="flex items-center gap-3 flex-1">
        <Button variant="ghost" size="icon">
          <ChevronLeft />
        </Button>
        <Input placeholder="Search..." className="max-w-sm w-full" />
      </div>
      <Button variant="outline" onClick={handleFolderSelection}>
        <Plus />
        <span className="text-xs">Scan Folder</span>
      </Button>
    </header>
  );
};
export default AppHeader;

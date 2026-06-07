import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AppHeader = () => {
  return (
    <header className="h-16 flex items-center justify-between px-4">
      <div className="flex items-center gap-3 flex-1">
        <Button variant="ghost" size="icon">
          <ChevronLeft/>
        </Button>
        <Input placeholder="Search..." className="max-w-sm w-full" />
      </div>
      <Button variant="outline">
        <Plus />
        <span className="text-xs">Scan Folder</span>
      </Button>
    </header>
  );
};
export default AppHeader;

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import SearchDialog from "@/features/search/components/SearchDialog";
import ImportButton from "@/features/import/components/ImportButton";

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

  return (
    <header className="h-16 m-2 mt-2.5 p-2 sticky top-2 rounded-3xl shadow-md border border-muted-foreground/30 bg-muted/50 dark:bg-sidebar/50 backdrop-blur-lg z-10 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <Button
          variant="outline"
          className="border border-secondary-foreground/30"
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

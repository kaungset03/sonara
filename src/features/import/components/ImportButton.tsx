import { Plus } from "lucide-react";
import { open } from "@tauri-apps/plugin-dialog";
import { Button } from "@/components/ui/button";
import useImportFilesMutation from "@/features/import/api/useImportFilesMutation";
import LoadingOverlay from "@/components/custom/LoadingOverlay";

const ImportButton = () => {
  const mutation = useImportFilesMutation();

  const handleFolderSelection = async () => {
    // Implementation for folder selection
    const path = await open({
      multiple: false,
      directory: true,
    });
    if (path) {
      mutation.mutate(path);
    }
  };
  return (
    <>
      <Button
        variant="outline"
        className="border border-muted-foreground/30"
        onClick={handleFolderSelection}
      >
        <Plus size={10} />
        <span className="text-xs font-heading text-foreground">Import</span>
      </Button>
      <LoadingOverlay open={mutation.isPending} />
    </>
  );
};
export default ImportButton;

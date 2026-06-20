import { Button } from "@/components/ui/button";
import LoadingOverlay from "@/components/custom/LoadingOverlay";
import useSyncLibraryFoldersMutation from "@/features/settings/api/useSyncLibraryFoldersMutation";

const SyncLibraryFolders = () => {
  const mutation = useSyncLibraryFoldersMutation();

  const handleSyncLibrary = () => {
    mutation.mutate();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Scan folders for new or updated music files
        </p>

        <Button
          size="sm"
          className="text-xs font-medium"
          onClick={handleSyncLibrary}
        >
          Sync Library
        </Button>
      </div>
      <LoadingOverlay open={mutation.isPending} />
    </>
  );
};
export default SyncLibraryFolders;

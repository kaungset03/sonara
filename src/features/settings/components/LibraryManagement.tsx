import ImportButton from "@/features/import/components/ImportButton";
import RemoveFolderAlert from "@/features/settings/components/RemoveFolderAlert";
import useGetImportedFoldersQuery from "@/features/settings/api/useGetImportedFoldersQuery";

const LibraryManagement = () => {
  const { data: folders } = useGetImportedFoldersQuery();
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Imported Folders</p>
          <p className="text-xs text-muted-foreground">
            Manage folders used to build your music library
          </p>
        </div>

        <ImportButton />
      </div>

      {folders && (
        <div className="space-y-2">
          {folders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No folders added yet. Import a folder to get started.
            </p>
          ) : (
            folders.map((folder) => (
              <div
                key={folder.id}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium truncate">
                    📁 {folder.path}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {folder.song_count} songs
                  </p>
                </div>

                <RemoveFolderAlert folderId={folder.id} />
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
};
export default LibraryManagement;

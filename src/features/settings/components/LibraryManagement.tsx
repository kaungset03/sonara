import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LibraryFolders from "@/features/settings/components/LibraryFolders";
import SyncLibraryFolders from "@/features/settings/components/SyncLibraryFolders";
import useCleanUpLibraryMutation from "@/features/settings/api/useCleanUpLibraryMutation";
import useGetAppConfigQuery from "@/features/settings/api/useGetAppConfigQuery";
import useUpdateAppConfigMutation from "@/features/settings/api/useUpdateAppConfigMutation";

const LibraryManagement = () => {
  const autoDownloadEnabled = useGetAppConfigQuery();
  const { mutate: updateAppConfig } = useUpdateAppConfigMutation();
  const { mutate } = useCleanUpLibraryMutation();

  const handleAutoDownloadChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isChecked = event.target.checked;
    updateAppConfig(isChecked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Library Management</CardTitle>
        <CardDescription>Manage your music library</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LibraryFolders />

        <Separator />

        <SyncLibraryFolders />

        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Clean up artists/albums without songs from the library. This will
            not delete any songs from your library.
          </p>

          <Button
            variant="outline"
            size="sm"
            className="text-xs font-medium text-destructive border border-destructive"
            onClick={() => mutate()}
          >
            Clean Up
          </Button>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Automatically download missing album covers and artist images from
            the internet.
          </p>

          <Input
            checked={autoDownloadEnabled}
            type="checkbox"
            className="size-5"
            onChange={handleAutoDownloadChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};
export default LibraryManagement;

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LibraryFolders from "@/features/settings/components/LibraryFolders";
import SyncLibraryFolders from "@/features/settings/components/SyncLibraryFolders";

const LibraryManagement = () => {
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
      </CardContent>
    </Card>
  );
};
export default LibraryManagement;

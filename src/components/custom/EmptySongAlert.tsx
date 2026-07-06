import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Music } from "lucide-react";
import ImportButton from "@/features/import/components/ImportButton";

const EmptySongAlert = () => {
  return (
    <Empty className="mt-20">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Music size={48} className="text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>No Songs Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t added any songs yet. Get started by importing some
          music.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <ImportButton />
      </EmptyContent>
    </Empty>
  );
};
export default EmptySongAlert;

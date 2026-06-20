import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type LoadingOverlayProps = {
  open: boolean;
}

const LoadingOverlay = ({ open }: LoadingOverlayProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent
        size="sm"
        className="border border-secondary-foreground/30 bg-muted/50 dark:bg-sidebar/50 backdrop-blur-lg"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Importing Files...
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            Please wait while we import your music files. This may take a few
            moments.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col items-center justify-center py-4">
          <div className="size-4 rounded-full border-t border-primary animate-spin" />
          <span className="text-sm text-muted-foreground mt-4">Processing</span>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default LoadingOverlay;

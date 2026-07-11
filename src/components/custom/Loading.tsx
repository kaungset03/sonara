const Loading = () => {
  return (
    <div className="w-full min-h-[65vh] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center py-4">
        <div className="size-4 rounded-full border-t border-primary animate-spin" />
        <span className="text-sm text-muted-foreground mt-4">Processing</span>
      </div>
    </div>
  );
};
export default Loading;

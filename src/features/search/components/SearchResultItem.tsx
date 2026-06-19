type SearchResultItemProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  handleClick: () => void;
};

const SearchResultItem = ({
  title,
  description,
  icon,
  handleClick,
}: SearchResultItemProps) => {
  return (
    <button
      onClick={handleClick}
      className="w-full rounded-xl p-3 text-left transition-colors hover:bg-muted"
    >
      <div className="flex items-start gap-3">
        <div className="size-8 flex items-center justify-center">{icon}</div>
        <div className="flex-1 min-w-0 space-y-0.5">
          <p className="font-medium text-sm truncate text-foreground">
            {title}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};
export default SearchResultItem;

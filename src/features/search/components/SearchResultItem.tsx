type SearchResultItemProps = {
  title: string;
  description?: string;
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
      className="w-full h-15 rounded-xl p-3 text-left transition-colors hover:bg-muted"
    >
      <div className="flex items-center gap-x-4">
        {icon}
        <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
          <span className="text-sm font-medium truncate">{title}</span>
          {description && (
            <span className="text-xs text-muted-foreground truncate">
              {description}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};
export default SearchResultItem;

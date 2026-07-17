import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type InputComboboxProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: Array<{ id: number; name: string }> | undefined;
};

const InputCombobox = ({
  label,
  value,
  onChange,
  suggestions,
}: InputComboboxProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowDropdown(true);
  };

  return (
    <div className="flex-1 relative">
      <div className="space-y-1">
        <Label htmlFor={label} className="text-xs text-muted-foreground">
          {label}
        </Label>
        <Input
          id={label}
          name={label}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setShowDropdown(false)}
          className="h-9 text-xs"
        />
      </div>
      {showDropdown && suggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full bg-background rounded-xl scrollbar-none max-h-48 overflow-auto">
          {suggestions.map((suggestion: { id: number; name: string }) => (
            <div
              key={suggestion.id}
              className="p-3 text-xs cursor-pointer hover:bg-muted"
              onMouseDown={() => {
                onChange(suggestion.name);
                setShowDropdown(false);
              }}
            >
              {suggestion.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default InputCombobox;

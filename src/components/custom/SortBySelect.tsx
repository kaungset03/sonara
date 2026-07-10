import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

type Option = {
  value: SortValue;
  label: string;
};

const options: Option[] = [
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
  {
    label: "Date Added (Newest First)",
    value: "created_at-desc",
  },
  {
    label: "Date Added (Oldest First)",
    value: "created_at-asc",
  },
];

type SortBySelectProps = {
  value: SortValue;
  defaultValue?: SortValue;
  onValueChange: (sortValue: SortValue) => void;
};

const defaultSortValue = options[0].value;

const SortBySelect = ({
  value,
  defaultValue = defaultSortValue,
  onValueChange,
}: SortBySelectProps) => {
  const handleValueChange = (selectedValue: string) => {
    onValueChange(selectedValue as SortValue);
  };

  return (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-full max-w-48 text-xs font-medium">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((item) => (
            <SelectItem className="text-xs font-medium" key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
export default SortBySelect;

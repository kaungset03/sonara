import { useEffect, useState } from "react";

type DebounceProps = {
  value: string;
};
const useDebounce = ({ value }: DebounceProps) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
};
export default useDebounce;

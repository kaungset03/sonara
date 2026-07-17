import { useEffect, useState } from "react";

type DebounceProps = {
  value: string;
  timeout?: number;
};
const useDebounce = ({ value, timeout = 500 }: DebounceProps) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, timeout);

    return () => {
      clearTimeout(handler);
    };
  }, [timeout, value]);

  return debouncedValue;
};
export default useDebounce;

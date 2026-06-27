import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
interface MarqueeTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
}

const MarqueeText = ({ text, className, ...props }: MarqueeTextProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    setOverflow(el.scrollWidth > el.clientWidth);
  }, [text]);

  return (
    <div className="min-w-0 overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "whitespace-nowrap",
          overflow ? "animate-marquee inline-block hover:paused" : "truncate",
          className,
        )}
        {...props}
      >
        {text}
      </div>
    </div>
  );
};

export default MarqueeText;

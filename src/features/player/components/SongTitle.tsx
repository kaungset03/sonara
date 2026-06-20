import { useEffect, useRef, useState } from "react";

const SongTitle = ({ text }: { text: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    setOverflow(ref.current.scrollWidth > ref.current.clientWidth);
  }, [text]);

  return (
    <div className="min-w-0 overflow-hidden">
      <div
        ref={ref}
        className={[
          "whitespace-nowrap text-sm font-medium font-heading",
          overflow ? "animate-marquee inline-block hover:paused" : "truncate",
        ].join(" ")}
      >
        {text}
      </div>
    </div>
  );
};

export default SongTitle;

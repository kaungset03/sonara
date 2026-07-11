import { useEffect, useRef, useState } from "react";
import { parseLRC } from "@/lib/helpers";

type RenderLyricsViewProps = {
  content: string;
  audioCurrentTime: number;
};

const RenderLyricsView = ({
  content,
  audioCurrentTime,
}: RenderLyricsViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const lyricsLines = parseLRC(content);

  const lastIndexRef = useRef(-1);

  useEffect(() => {
    if (!lyricsLines?.length) return;

    let currentLineIndex = -1;

    for (let i = 0; i < lyricsLines.length; i++) {
      if (audioCurrentTime >= lyricsLines[i].time) {
        currentLineIndex = i;
      } else {
        break;
      }
    }

    if (currentLineIndex !== lastIndexRef.current) {
      lastIndexRef.current = currentLineIndex;
      setActiveIndex(currentLineIndex);
    }
  }, [audioCurrentTime, lyricsLines]);

  useEffect(() => {
    if (activeIndex !== -1 && containerRef.current) {
      const activeElement = containerRef.current.children[activeIndex];
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [activeIndex]);

  if (lyricsLines) {
    return (
      <div
        ref={containerRef}
        className="h-90 w-full overflow-y-auto space-y-4 p-4 text-center scrollbar-none mask-fade-y"
      >
        {lyricsLines.map((line, index) => (
          <p
            key={`${line.time}-${index}`}
            className={`text-xl font-medium font-heading transition-all duration-300 ${
              index === activeIndex
                ? "text-primary scale-105 font-bold opacity-100"
                : "text-muted-foreground opacity-40"
            }`}
          >
            {line.text || ". . ."}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="h-90 w-full flex justify-center items-center text-center">
      <p className="font-heading font-medium text-muted-foreground mb-4">
        Error in loading lyrics.
        <br /> Please make sure the lyrics file exists and is accessible.
      </p>
    </div>
  );
};
export default RenderLyricsView;

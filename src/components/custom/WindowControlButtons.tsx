import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect, useRef, useState } from "react";

const WindowControlButtons = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const appWindow = getCurrentWindow();

  const handleClose = async () => {
    await appWindow.close();
  };

  const handleMinimize = async () => {
    await appWindow.minimize();
  };

  const handleFullscreen = async () => {
    await appWindow.setFullscreen(!(await appWindow.isFullscreen()));
  };

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setup = async () => {
      unlisten = await appWindow.onResized(async () => {
        const fs = await appWindow.isFullscreen();
        setIsFullscreen(fs);
      });

      // initial sync (VERY IMPORTANT)
      setIsFullscreen(await appWindow.isFullscreen());
    };

    setup();

    return () => {
      unlisten?.();
    };
  }, []);

  const handler = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.buttons === 1) {
      e.detail === 2
        ? await appWindow.toggleMaximize()
        : await appWindow.startDragging();
    }
  };

  return (
    <div
      className={`group/btn flex items-start gap-x-2 w-fit h-fit mr-auto mb-auto p-1 transition-opacity ${isFullscreen ? "opacity-0" : "opacity-100"}`}
      ref={containerRef}
      data-tauri-drag-region
      onMouseDown={handler}
    >
      <button
        className="size-3.5 rounded-full flex items-center justify-center relative bg-[#FF5F56] border border-[#E0443E]"
        aria-label="Close"
        onClick={handleClose}
      >
        <svg
          className="size-1.5 group-hover/btn:text-[#4C0002] text-transparent transition-colors stroke-[2.5]"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
        >
          <path d="M1 1L9 9M9 1L1 9" />
        </svg>
      </button>

      {/* Minimize Button */}
      <button
        className="size-3.5 rounded-full flex items-center justify-center relative bg-[#FFBD2E] border border-[#DEA123]"
        aria-label="Minimize"
        onClick={handleMinimize}
      >
        <svg
          className="size-1.5 group-hover/btn:text-[#5C3E00] text-transparent transition-colors stroke-3"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
        >
          <path d="M1 5H9" />
        </svg>
      </button>

      {/* Maximize / Fullscreen Button */}
      <button
        className="size-3.5 rounded-full flex items-center justify-center relative bg-[#27C93F] border border-[#1AAA2C]"
        aria-label="Fullscreen"
        onClick={handleFullscreen}
      >
        <svg
          className="size-1.5 group-hover/btn:text-[#004D03] text-transparent transition-colors"
          viewBox="0 0 10 10"
          fill="currentColor"
        >
          {/* Top-Left Triangle (Extended closer to center) */}
          <path d="M0 0H7L0 7V0Z" />
          {/* Bottom-Right Triangle (Extended closer to center) */}
          <path d="M10 10H3L10 3V10Z" />
        </svg>
      </button>
    </div>
  );
};
export default WindowControlButtons;

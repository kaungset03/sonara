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
      e.detail === 2 ? await appWindow.toggleMaximize() : await appWindow.startDragging();
    }
  };

  return (
    <div
      className={`flex items-start gap-x-2 w-full h-full px-1 py-1.5 transition-opacity ${isFullscreen ? "opacity-0" : "opacity-100"}`}
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
          className="w-1.5 h-1.5 text-[#4C0002] stroke-[2.5]"
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
          className="w-2 h-2 text-[#5C3E00] stroke-3"
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
          className="w-1.5 h-1.5 text-[#004D03]"
          viewBox="0 0 10 10"
          fill="currentColor"
        >
          <path
            d="M1 4.5V1H4.5M9 5.5V9H5.5"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </button>
    </div>
  );
};
export default WindowControlButtons;

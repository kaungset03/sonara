const getFormattedDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const shuffleQueue = (q: QueueItem[]) => {
  const shuffled = [...q];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const parseLRC = (lrcText: string): LyricLine[] => {
  const lines = lrcText.split("\n");
  const lyrics: LyricLine[] = [];

  // Regex to match the [mm:ss.xx] or [mm:ss.xxx] format
  const timeRegex = /^\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  lines.forEach((line) => {
    const match = timeRegex.exec(line.trim());

    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);

      const milliseconds = parseInt(match[3].padEnd(3, "0"), 10);

      const timeInSeconds = minutes * 60 + seconds + milliseconds / 1000;
      const text = line.replace(timeRegex, "").trim();

      lyrics.push({ time: timeInSeconds, text });
    }
  });

  return lyrics.sort((a, b) => a.time - b.time);
};

export { getFormattedDuration, shuffleQueue, parseLRC };

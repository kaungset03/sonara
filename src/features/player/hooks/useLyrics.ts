import { useQuery } from "@tanstack/react-query";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { parseLRC } from "@/lib/helpers";

type UseLyricsProps = {
  filePath: string;
};

const useLyrics = ({ filePath }: UseLyricsProps) => {
  const { data: lyricsLines } = useQuery({
    queryKey: ["lyrics", filePath],
    queryFn: async () => {
      // const contents = await readTextFile(filePath);
      // return parseLRC(contents);
      try {
        const contents = await readTextFile(filePath);
        return parseLRC(contents);
      } catch (e) {
        console.error("Error reading lyrics file:", e);
        return [];
      }
    },
    enabled: !!filePath,
  });
  return { lyricsLines };
};
export default useLyrics;

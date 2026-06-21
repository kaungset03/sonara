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
      const contents = await readTextFile(filePath);
      return parseLRC(contents);
    },
    enabled: !!filePath,
  });
  return { lyricsLines };
};
export default useLyrics;

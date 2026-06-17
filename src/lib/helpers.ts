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

// type Updater = (song: Song) => Song;

// const updateSongInCache = (
//   queryClient: QueryClient,
//   songId: number,
//   updater: Updater,
// ) => {
//   queryClient.setQueriesData<Song[]>({ queryKey: ["songs"] }, (old) => {
//     if (!old) return old;

//     return old.map((song) => (song.id === songId ? updater(song) : song));
//   });
// };

export { getFormattedDuration, shuffleQueue };

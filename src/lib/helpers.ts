const getFormattedDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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

export { getFormattedDuration };

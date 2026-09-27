

// const AlbumCard = () => {
//   return (
//     <Link
//       to={"/albums/$id"}
//       params={{ id: album.id.toString() }}
//       key={album.id}
//       className="group flex flex-col gap-1"
//     >
//       <div className="relative w-full aspect-square shrink-0 bg-linear-to-br from-primary/30 to-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
//         {album.cover_path ? (
//           <img
//             src={convertFileSrc(album.cover_path)}
//             alt={album.name}
//             className="w-full h-full object-cover object-center scale-110 group-hover:scale-100 transition-transform ease-in-out duration-350"
//           />
//         ) : (
//           <span className="text-4xl font-bold text-muted-foreground">
//             {initials}
//           </span>
//         )}
//       </div>

//       <div className="space-y-1 flex-1">
//         <h3 className="font-semibold group-hover:text-primary transition-colors text-ellipsis overflow-hidden whitespace-nowrap ">
//           {album.name}
//         </h3>
//         <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors text-ellipsis overflow-hidden whitespace-nowrap ">
//           {album.artist_name}
//         </p>
//       </div>
//     </Link>
//   );
// };
// export default AlbumCard;

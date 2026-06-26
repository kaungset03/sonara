// use std::fs;

// use rusqlite::{Connection, Result};

// pub fn process_album_artwork(
//     conn: &Connection,
//     artwork: Option<Vec<u8>>,
//     album_id: i64,
// ) -> Result<()> {
//     let artwork = match artwork {
//         Some(data) => data,
//         None => return Ok(()),
//     };

//     let current: Option<String> = conn.query_row(
//         "SELECT artwork_path FROM albums WHERE id = ?1",
//         [album_id],
//         |row| row.get(0),
//     )?;

//     if current.is_some() {
//         return Ok(());
//     }

//     let path = format!("artwork/album_{}.jpg", album_id);
//     fs::write(&path, artwork).unwrap();

//     conn.execute(
//         "UPDATE albums SET artwork_path = ?1 WHERE id = ?2",
//         (&path, album_id),
//     )?;

//     Ok(())
// }

// // pub fn process_artist_image(
// //     conn: &Connection,
// //     image: Option<Vec<u8>>,
// //     artist_id: i64,
// // ) -> Result<()> {
// //     let image = match image {
// //         Some(data) => data,
// //         None => return Ok(()),
// //     };

// //     let current: Option<String> = conn.query_row(
// //         "SELECT image_path FROM artists WHERE id = ?1",
// //         [artist_id],
// //         |row| row.get(0),
// //     )?;

// //     if current.is_some() {
// //         return Ok(());
// //     }

// //     let path = format!("artwork/artist_{}.jpg", artist_id);
// //     fs::write(&path, image).unwrap();

// //     conn.execute(
// //         "UPDATE artists SET image_path = ?1 WHERE id = ?2",
// //         (&path, artist_id),
// //     )?;

// //     Ok(())
// // }
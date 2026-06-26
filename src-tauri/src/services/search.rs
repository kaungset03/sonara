// use crate::{models::search::SearchResults, repositories::song_repository};

// // preview search results for songs, artists, and albums (No Limit yet)
// pub fn preview_search_results(
//     conn: &rusqlite::Connection,
//     search: &str,
// ) -> Result<SearchResults, String> {
//     let songs =
//         song_repository::search_songs_by_title_query(conn, search).map_err(|e| e.to_string())?;
//     let artists =
//         song_repository::search_artists_by_name_query(conn, search).map_err(|e| e.to_string())?;
//     let albums =
//         song_repository::search_albums_by_name_query(conn, search).map_err(|e| e.to_string())?;

//     Ok(SearchResults {
//         songs,
//         artists,
//         albums,
//     })
// }

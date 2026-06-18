use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Stats {
    pub total_songs: i64,
    pub total_albums: i64,
    pub total_artists: i64,
    pub total_favorites: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HomeData {
    pub stats: Stats,
    pub recently_added_songs: Vec<crate::models::song::Song>,
    pub most_played_songs: Vec<crate::models::song::Song>,
    pub recently_played_songs: Vec<crate::models::song::Song>,
}

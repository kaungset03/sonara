use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Song {
    pub id: i64,
    pub title: String,
    pub artist: String,
    pub album: String,
    //pub album_artwork_path: Option<String>,
    pub duration: i64,
    pub path: String,
    pub lyrics_path: Option<String>,
    pub is_favorite: bool,
    pub favorite_added_at: Option<i64>,
    pub last_played_at: Option<i64>,
    pub play_count: i32,
    pub created_at: i64,
}

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Song {
    pub id: i64,
    pub title: String,
    pub artist: String,
    pub album: String,
    pub duration: i64,
    pub path: String,
    pub is_favorite: bool,
    pub favorite_added_at: Option<i64>,
    pub created_at: i64,
}

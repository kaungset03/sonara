use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Song {
    pub id: i64,
    pub title: String,
    pub duration: i64,
    pub path: String,
    pub is_favorite: bool,
    pub favorite_added_at: Option<i64>,
    pub track_number: Option<i32>,
    pub last_played_at: Option<i64>,
    pub play_count: i32,
    pub lyrics_path: Option<String>,
    pub created_at: i64,
    pub file_modified_at: i64,
    pub file_size: i64,
    pub folder_id: Option<i64>,
    pub album_id: i64,
    pub artist_id: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SongResponse {
    pub id: i64,
    pub title: String,
    pub artist_id: i64,
    pub artist_name: String,
    pub album_id: i64,
    pub album_name: String,
    pub album_cover_path: Option<String>,
    pub duration: i64,
    pub path: String,
    pub is_favorite: bool,
    pub favorite_added_at: Option<i64>,
    pub track_number: Option<i32>,
    pub last_played_at: Option<i64>,
    pub play_count: i32,
    pub lyrics_path: Option<String>,
    pub created_at: i64,
    pub file_modified_at: i64,
    pub file_size: i64,
    pub folder_id: Option<i64>,
}

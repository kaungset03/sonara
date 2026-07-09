use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AlbumEntity {
    pub id: i64,
    pub name: String,
    pub artist_id: i64,
    pub cover_path: Option<String>,
    pub cover_status: String,
    pub created_at: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Album {
    pub id: i64,
    pub name: String,
    pub artist_id: i64,
    pub artist_name: String,
    pub cover_path: Option<String>,
    pub cover_status: String,
    pub created_at: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AlbumDetails {
    pub album: Album,
    pub songs: Vec<crate::models::song::SongResponse>,
}

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Album {
    pub id: i64,
    pub name: String,
    pub artist_id: Option<i64>,
    pub artwork_path: Option<String>,
    pub created_at: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AlbumDetails {
    pub album: Album,
    pub songs: Vec<crate::models::song::SongResponse>,
}

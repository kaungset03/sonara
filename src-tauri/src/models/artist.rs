use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Artist {
    pub id: i64,
    pub name: String,
    pub image_path: Option<String>,
    pub image_status: String,
    pub created_at: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ArtistDetails {
    pub artist: Artist,
    pub songs: Vec<crate::models::song::SongResponse>,
}

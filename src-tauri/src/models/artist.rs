use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Artist {
    pub id: i64,
    pub name: String,
    pub image_path: Option<String>,
    pub created_at: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ArtistDetails {
    pub artist: Artist,
    pub songs: Vec<Song>,
}

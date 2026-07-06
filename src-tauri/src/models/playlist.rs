use serde::{Deserialize, Serialize};

use crate::models::song::SongResponse;

#[derive(Debug, Serialize, Deserialize)]
pub struct Playlist {
    pub id: i64,
    pub name: String,
    pub created_at: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PlaylistDetails {
    pub playlist: Playlist,
    pub songs: Vec<SongResponse>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AddSongsResult {
    pub added: usize,
    pub skipped: usize,
}

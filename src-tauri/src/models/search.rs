use serde::{Deserialize, Serialize};

use crate::models::{album::Album, artist::Artist, song::SongResponse};

#[derive(Debug, Serialize, Deserialize)]
pub struct SearchResults {
    pub songs: Vec<SongResponse>,
    pub artists: Vec<Artist>,
    pub albums: Vec<Album>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LiveSearchResult {
    pub id: i64,
    pub name: String,
}

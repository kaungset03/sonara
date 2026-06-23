use serde::{Deserialize, Serialize};

use crate::models::{album::Album, artist::Artist, song::Song};

#[derive(Debug, Serialize, Deserialize)]
pub struct SearchResults {
    pub songs: Vec<Song>,
    pub artists: Vec<Artist>,
    pub albums: Vec<Album>,
}
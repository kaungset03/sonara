use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Lyrics {
    pub id: i64,
    pub song_id: i64,
    pub path: String,
    pub status: String,
    pub created_at: i64,
}

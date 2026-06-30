use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Lyrics {
    pub id: i64,
    pub song_id: i64,
    pub path: Option<String>,
    pub status: String,
}

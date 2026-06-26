use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct Folder {
    pub id: i64,
    pub path: String,
    pub song_count: i64,
    pub created_at: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ImportResult {
    pub added: usize,
    pub failed: usize,
    pub removed: usize,
}

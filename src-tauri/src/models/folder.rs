use serde::{Deserialize, Serialize};
#[derive(Debug)]
pub struct Folder {
    pub id: i64,
    pub path: String,
    pub created_at: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ImportResult {
    pub imported: usize,
    pub skipped: usize,
    pub failed: usize,
}

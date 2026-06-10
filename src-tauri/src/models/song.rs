#[derive(Debug)]
pub struct Song {
    pub title: String,
    pub artist: String,
    pub album: String,
    pub duration: i64,
    pub path: String,
    pub created_at: i64,
}

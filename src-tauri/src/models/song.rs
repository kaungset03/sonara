#[derive(Debug)]
pub struct Song {
    pub id: i64,
    pub title: String,
    pub artist: String,
    pub album: String,
    pub duration: i64,
    pub created_at: i64,
}

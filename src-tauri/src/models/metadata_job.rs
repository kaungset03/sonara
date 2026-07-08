use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct MetadataJob {
    pub id: i64,
    pub entity_type: String,
    pub entity_id: i64,
    pub job_type: String,
    pub status: String,
    pub attempt_count: i32,
    pub last_error: Option<String>,
    pub created_at: i64,
    pub updated_at: i64,
}

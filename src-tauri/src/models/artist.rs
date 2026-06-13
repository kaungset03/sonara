use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Artist {
    pub name: String,
    pub count: i64, // number of songs by the artist
}

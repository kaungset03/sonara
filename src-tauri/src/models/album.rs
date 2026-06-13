use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Album {
    pub name: String,
    pub count: i64, // number of songs in the album
}

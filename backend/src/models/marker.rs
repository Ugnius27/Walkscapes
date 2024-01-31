use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(FromRow, Serialize, Deserialize)]
pub struct Marker {
    pub id: i32,
    pub latitude: f64,
    pub longitude: f64,
}

impl Marker {
    pub fn new() -> Self {
        Marker {
            id: 0,
            latitude: 0.0,
            longitude: 0.0,
        }
    }
}




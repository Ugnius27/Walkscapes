use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Polygon {
    pub id: i32,
    pub vertices: Vec<(f64, f64)>,
}

impl Polygon {
    pub fn new() -> Self {
        Polygon {
            id: 0,
            vertices: Vec::new(),
        }
    }
}

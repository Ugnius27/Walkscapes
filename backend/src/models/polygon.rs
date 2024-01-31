use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Polygon {
    pub id: i32,
    pub vertices: Vec<(f64, f64)>,
}


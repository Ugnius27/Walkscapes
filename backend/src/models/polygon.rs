use serde::Serialize;

#[derive(Serialize)]
pub struct Polygon {
    pub id: i32,
    pub vertices: Vec<(f64, f64)>,
}


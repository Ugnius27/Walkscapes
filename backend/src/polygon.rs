use serde::Serialize;
use sqlx::FromRow;

#[derive(Debug, FromRow, Serialize)]
pub struct Polygon {
    pub id: i32,
    pub vertices: serde_json::Value,
}

impl Polygon {
    pub fn new() -> Self {
        Polygon {
            id: 0,
            vertices: serde_json::Value::Null,
        }
    }
}

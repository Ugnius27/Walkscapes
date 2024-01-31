use serde::Serialize;
use sqlx::FromRow;

#[derive(FromRow)]
pub struct Record {
    id: i32,
    description: String,
}

impl Record {
    fn new() -> Self {
        Record {
            id: 0,
            description: String::new(),
        }
    }
}

#[derive(Serialize)]
pub struct RecordWithImageIDs {
    id: i32,
    description: String,
    images: Vec<i32>,
}




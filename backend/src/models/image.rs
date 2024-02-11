use serde::Serialize;
use sqlx::FromRow;

#[derive(FromRow, Serialize)]
pub struct Image {
    pub id: i32,
    pub record_id: i32,
    pub filename: String,
    pub image_data: Vec<u8>,
}

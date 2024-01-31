use serde::Serialize;
use sqlx::FromRow;

#[derive(FromRow, Serialize)]
pub struct Image {
    pub record_fk: i32,
    pub id: i32,
    pub filename: String,
    pub image_data: Vec<u8>,
}

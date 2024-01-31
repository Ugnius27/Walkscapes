use sqlx::{Error, MySqlPool};
use crate::models::Image;

pub async fn get_image_by_id(pool: &MySqlPool, record_id: i32, image_id: i32) -> Result<Image, Error> {
    Ok(sqlx::query_as!(Image,
        r#"SELECT * FROM images
        WHERE record_fk = ? AND id = ?"#,
        record_id, image_id)
        .fetch_one(pool.get_ref()).await?)
}
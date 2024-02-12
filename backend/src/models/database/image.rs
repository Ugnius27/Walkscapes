use sqlx::{Error, MySql, MySqlPool};
use crate::models::Image;

pub async fn get_image_by_id(pool: &MySqlPool, image_id: i32) -> Result<Image, Error> {
    Ok(sqlx::query_as!(Image,
        r#"SELECT * FROM images
        WHERE id = ?"#,
        image_id
    ).fetch_one(pool).await?)
}

pub async fn get_image_ids_by_record_id(pool: &MySqlPool, record_id: i32) -> Result<Vec<i32>, Error> {
    Ok(sqlx::query_scalar!(
        r#"SELECT id FROM images
        WHERE record_id = ?"#,
        record_id
    ).fetch_all(pool).await?)
}

pub async fn insert_image_transaction(transaction: &mut sqlx::Transaction<'_, MySql>, image: Image) -> Result<(), Error> {
    sqlx::query!(
        r#"INSERT INTO images
        (id, record_id, filename, image_data)
        VALUES
        (?, ?, ?, ?)"#,
        image.id,
        image.record_id,
        image.filename,
        image.image_data
    ).execute(&mut **transaction).await?;
    Ok(())
}

pub async fn delete_images_by_record_id_transaction(transaction: &mut sqlx::Transaction<'_, MySql>, record_id: i32) -> Result<(), Error> {
    sqlx::query!(
        r#"DELETE FROM images
        WHERE record_id = ?"#,
        record_id
    ).execute(&mut **transaction).await?;
    Ok(())
}
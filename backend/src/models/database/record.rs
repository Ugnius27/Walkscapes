use sqlx::MySqlPool;
use crate::image::Image;
use crate::record::Record;

pub async fn get_records_by_marker_id(pool: &MySqlPool, marker_id: i32) -> Result<Vec<Record>, sqlx::Error> {
    Ok(sqlx::query_as!(Record,
        r#"SELECT * FROM records
        WHERE marker_fk = ?"#,
        marker_id)
        .fetch_all(pool.get_ref()).await?)
}

pub async fn insert_record_image(pool: &MySqlPool, image: Image, record_fk: i32) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"INSERT INTO images (record_fk, filename, image_data)
        VALUES (?, ?, ?)"#,
        record_fk, image.filename, image.image_data)
        .execute(pool).await?;
    Ok(())
}

pub async fn insert_record(pool: &MySqlPool, record: Record) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"INSERT INTO records (marker_fk, description)
        VALUES (?, ?)"#,
        record.id, record.description)
        .execute(pool).await?;
    Ok(())
}

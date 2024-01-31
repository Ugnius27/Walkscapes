use sqlx::{MySql, MySqlPool};
use crate::models::{Image, Record};

pub async fn get_records_by_marker_id(pool: &MySqlPool, marker_id: i32) -> Result<Vec<Record>, sqlx::Error> {
    Ok(sqlx::query_as!(Record,
        r#"SELECT * FROM records
        WHERE marker_id = ?"#,
        marker_id)
        .fetch_all(pool).await?)
}

pub async fn insert_image_with_record_id(pool: &MySqlPool, image: Image, record_id: i32) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"INSERT INTO images (record_id, filename, image_data)
        VALUES (?, ?, ?)"#,
        record_id, image.filename, image.image_data)
        .execute(pool).await?;
    Ok(())
}

pub async fn insert_record_transaction(transaction: &mut sqlx::Transaction<'_, MySql>, record: Record) -> Result<i32, sqlx::Error> {
    let result = sqlx::query!(
        r#"INSERT INTO records (marker_id, description)
        VALUES (?, ?)"#,
        record.marker_id, record.description)
        .execute(&mut **transaction).await?;

    Ok(result.last_insert_id() as i32)
}

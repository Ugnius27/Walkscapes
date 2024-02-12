use sqlx::{MySql, MySqlPool};
use crate::models::{Image, Record};

pub async fn get_records_by_marker_id(pool: &MySqlPool, marker_id: i32) -> Result<Vec<Record>, sqlx::Error> {
    Ok(sqlx::query_as!(
        Record,
        r#"SELECT * FROM records
        WHERE marker_id = ?"#,
        marker_id)
        .fetch_all(pool).await?)
}

pub async fn get_records_count_by_marker_id(pool: &MySqlPool, marker_id: i32) -> Result<i32, sqlx::Error> {
    let count = sqlx::query_scalar!(
        r#"SELECT COUNT(*) as count
        FROM records
        WHERE marker_id = ?"#,
        marker_id
    ).fetch_one(pool).await?;
    Ok(count as i32)
}

pub async fn get_record_by_id(pool: &MySqlPool, record_id: i32) -> Result<Record, sqlx::Error> {
    Ok(sqlx::query_as!(
        Record,
        r#"SELECT * FROM records
        WHERE id = ?"#,
        record_id)
        .fetch_one(pool).await?
    )
}

pub async fn insert_record_transaction(transaction: &mut sqlx::Transaction<'_, MySql>, record: Record) -> Result<i32, sqlx::Error> {
    let result = sqlx::query!(
        r#"INSERT INTO records (marker_id, description)
        VALUES (?, ?)"#,
        record.marker_id, record.description)
        .execute(&mut **transaction).await?;

    Ok(result.last_insert_id() as i32)
}

pub async fn delete_record_by_id_transaction(transaction: &mut sqlx::Transaction<'_, MySql>, record_id: i32) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"DELETE FROM records
        WHERE id = ?"#,
        record_id
    ).execute(&mut **transaction).await?;
    Ok(())
}
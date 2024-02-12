use crate::models::Marker;
use sqlx::{Error, MySql, MySqlPool, Transaction};

pub async fn insert_marker_transaction(transaction: &mut Transaction<'_, MySql>, marker: Marker) -> Result<i32, Error> {
    let result = sqlx::query!(
        r#"INSERT INTO markers (latitude, longitude)
        VALUES (?, ?)"#,
        marker.latitude,
        marker.longitude
    ).execute(&mut **transaction).await?;
    Ok(result.last_insert_id() as i32)
}

pub async fn get_markers_with_records(pool: &MySqlPool) -> Result<Vec<Marker>, Error> {
    Ok(sqlx::query_as!(
        Marker,
        r#"SELECT markers.id, latitude, longitude
        FROM markers
        INNER JOIN records on records.marker_id = markers.id"#)
        .fetch_all(pool).await?)
}

pub async fn get_markers(pool: &MySqlPool) -> Result<Vec<Marker>, Error> {
    Ok(sqlx::query_as!(
       Marker,
       r#"SELECT * FROM markers"#
   ).fetch_all(pool).await?)
}

pub async fn delete_marker_by_id_transaction(transaction: &mut Transaction<'_, MySql>, marker_id: i32) -> Result<(), Error> {
    sqlx::query!(
        r#"DELETE FROM markers
        WHERE id = ?"#,
        marker_id
    ).execute(&mut **transaction).await?;
    Ok(())
}
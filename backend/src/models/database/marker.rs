use crate::models::Marker;
use sqlx::{Error, MySqlPool};

pub async fn insert_marker(pool: &MySqlPool, marker: Marker) -> Result<i32, Error> {
    let result = sqlx::query!(
        r#"INSERT INTO markers (latitude, longitude)
        VALUES (?, ?)"#,
        marker.latitude,
        marker.longitude
    ).execute(pool).await?;
    Ok(result.last_insert_id() as i32)
}

pub async fn get_markers_with_records(pool: &MySqlPool) -> Result<Vec<Marker>, Error> {
    Ok(sqlx::query_as!(
        Marker,
        r#"SELECT markers.id, latitude, longitude
        FROM markers
        INNER JOIN records on records.marker_fk = markers.id"#)
        .fetch_all(pool.get_ref()).await?)
}
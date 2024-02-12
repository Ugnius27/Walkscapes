use std::collections::HashMap;
use std::iter::zip;
use actix_web::{get, Responder, web};
use sqlx::MySqlPool;
use crate::models::database::{image, marker, record};
use crate::routes::user_error::UserError;

#[get("api/markers")]
pub async fn get_markers(query: web::Query<HashMap<String, String>>, pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    let markers;
    if query.0.get("all").is_some() {
        markers = marker::get_markers(&pool).await?;
    } else {
        markers = marker::get_markers_with_records(&pool).await?;
    }
    Ok(web::Json(markers))
}

#[get("api/markers/{marker_id}/records")]
pub async fn get_marker_records(path: web::Path<i32>, pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    let records = record::get_records_by_marker_id(&pool, path.into_inner()).await?;

    let mut records_image_ids = Vec::with_capacity(records.len());
    for record in records.iter() {
        let image_ids = image::get_image_ids_by_record_id(&pool, record.id).await?;
        records_image_ids.push(image_ids);
    }

    let complete_records = zip(records, records_image_ids)
        .map(|(record, image_ids)|
            serde_json::json!({
                "id": record.id,
                "description": record.description,
                "image_ids": image_ids,
        }))
        .collect::<Vec<serde_json::Value>>();
    Ok(web::Json(complete_records))
}

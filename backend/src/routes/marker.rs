use actix_web::{get, HttpResponse, Responder, web};
use sqlx::MySqlPool;
use crate::models::database::{image, marker, record};
use crate::models::Record;
use crate::routes::user_error::UserError;

#[get("api/markers")]
pub async fn get_markers(pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    let markers = marker::get_markers_with_records(&pool).await?;
    Ok(web::Json(markers))
}

#[get("api/markers/{marker_id}/records")]
pub async fn get_marker_records(path: web::Path<i32>, pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    let mut records_with_image_ids = Vec::<(Record, Vec<i32>)>::new();

    let records = record::get_records_by_marker_id(&pool, path.into_inner()).await?;
    for record in records {
        let image_ids = image::get_image_ids_by_record_id(&pool, record.id).await?;
        records_with_image_ids.push((record, image_ids));
    }

    let records_with_image_ids: Vec<serde_json::Value> = records_with_image_ids
        .into_iter()
        .map(|(record, image_ids)| serde_json::json!({
            "id": record.id,
            "description": record.description,
            "image_ids": image_ids,
        })).collect();
    Ok(web::Json(records_with_image_ids))
}

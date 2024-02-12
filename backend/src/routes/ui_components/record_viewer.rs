use actix_web::{delete, get, HttpResponse, Responder, web};
use maud::Markup;
use sqlx::MySqlPool;
use crate::markup::record_viewer::{NavBehaviour, no_records, record_index, records_index};
use crate::models::database::{image, marker};
use crate::models::database::record;
use crate::models::database::record::get_records_by_marker_id;
use crate::routes::user_error::UserResult;

#[get("admin/record-viewer/markers/{marker_id}/records")]
pub async fn get_records(path: web::Path<i32>, pool: web::Data<MySqlPool>) -> UserResult<Markup> {
    let marker_id = path.into_inner();
    let records = record::get_records_by_marker_id(&pool, marker_id).await?;
    Ok(match records.len() {
        0 => no_records(marker_id),
        1 => {
            let record = &records[0];
            let image_ids = image::get_image_ids_by_record_id(&pool, record.id).await?;
            record_index(record, &image_ids, NavBehaviour::Close)
        }
        _ => records_index(&records)
    })
}

#[get("admin/record-viewer/records/{record_id}")]
pub async fn get_record(path: web::Path<i32>, pool: web::Data<MySqlPool>) -> UserResult<Markup> {
    let record_id = path.into_inner();
    let record = record::get_record_by_id(&pool, record_id).await?;
    let image_ids = image::get_image_ids_by_record_id(&pool, record_id).await?;

    let return_endpoint = format!("record-viewer/markers/{}/records", record.marker_id);
    Ok(record_index(&record, &image_ids, NavBehaviour::ToEndpoint(return_endpoint)))
}

#[delete("admin/record-viewer/records/{record_id}")]
pub async fn delete_record(path: web::Path<i32>, pool: web::Data<MySqlPool>) -> UserResult<impl Responder> {
    let record_id = path.into_inner();

    //todo
    let marker_id = record::get_record_by_id(&pool, record_id).await?.marker_id;
    let record_count = record::get_records_count_by_marker_id(&pool, marker_id).await?;

    let mut transaction = pool.begin().await?;
    image::delete_images_by_record_id_transaction(&mut transaction, record_id).await?;
    record::delete_record_by_id_transaction(&mut transaction, record_id).await?;

    //todo possibly move out and rethink
    if record_count == 1 {
        marker::delete_marker_by_id_transaction(&mut transaction, marker_id).await?;
        transaction.commit().await?;
        return Ok(no_records(marker_id));
    }

    transaction.commit().await?;
    let records = get_records_by_marker_id(&pool, marker_id).await?;
    Ok(records_index(&records))
}

#[delete("admin/record-viewer/markers/{marker_id}")]
pub async fn delete_marker(path: web::Path<i32>, pool: web::Data<MySqlPool>) -> UserResult<impl Responder> {
    let marker_id = path.into_inner();
    let mut transaction = pool.begin().await?;
    marker::delete_marker_by_id_transaction(&mut transaction, marker_id).await?;
    transaction.commit().await?;
    Ok(HttpResponse::Ok().body(""))
}
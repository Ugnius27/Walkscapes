use std::collections::HashMap;
use std::io::{BufReader, Read};
use actix_multipart::form::MultipartForm;
use actix_web::{get, HttpRequest, HttpResponse, post, Responder, web};
use futures_util::{StreamExt, TryStreamExt};
use sqlx::MySqlPool;
use crate::models::database::{image, record};
use crate::models::{Image, Record};
use crate::models::record::RecordUploadForm;
use crate::routes::user_error::UserError;

//todo change to save files on disk instead of in database
//todo SAFETY
#[post("api/markers/{marker_id}/records")]
pub async fn post_record(form: MultipartForm<RecordUploadForm>, path: web::Path<i32>, pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    let mut transaction = pool.begin().await?;
    let mut form = form.into_inner();

    let record_id = record::insert_record_transaction(
        &mut transaction,
        Record { id: 0, marker_id: path.into_inner(), description: form.description.0 },
    ).await?;

    //todo prevent empty file upload
    for file in form.files.iter_mut() {
        let mut bytes = file
            .file
            .as_file()
            .bytes() //this is potentially super slow as we are trying each byte
            .collect::<Result<Vec<u8>, _>>()
            .map_err(|_| UserError::Internal)?; //todo idk if this is internal

        image::insert_image_transaction(
            &mut transaction,
            Image {
                id: 0,
                record_id,
                filename: file.file_name.as_ref().unwrap_or(&String::from("")).to_string(),
                image_data: bytes,
            },
        ).await?;
    }
    transaction.commit().await?;
    Ok(HttpResponse::Ok().body(""))
}

//experimental
#[get("api/records")]
pub async fn get_records(query: web::Query<HashMap<String, String>>, pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    if let Some(marker_id) = query.0.get("marker-id") {
        let marker_id = marker_id.parse::<i32>()
            .map_err(|e| UserError::Parse("Could not parse 'marker-id' value in query".into()))?;
        let records = record::get_records_by_marker_id(&pool, marker_id).await?;
        return Ok(web::Json(records));
    }

    return Err(UserError::NotImplemented("Must be queried with a marker-id".into()));
}


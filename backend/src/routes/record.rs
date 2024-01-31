use std::collections::HashMap;
use std::io::{BufReader, Read};
use actix_multipart::form::MultipartForm;
use actix_multipart::Multipart;
use actix_web::{get, HttpRequest, HttpResponse, post, Responder, web};
use futures_util::{StreamExt, TryStreamExt};
use sqlx::MySqlPool;
use crate::models::database::{image, record};
use crate::models::{Image, Record};
use crate::models::record::RecordUploadForm;
use crate::routes::user_error::UserError;

//todo change to save files on disk instead of in database
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

// pub async fn post_record(mut payload: Multipart, marker_id: web::Path<i32>, pool: web::Data<MySqlPool>) -> impl Responder {
//     let pool = pool.get_ref();
//
//     let mut marker = Marker::new();
//     let mut record = Record::new();
//     let mut images: Vec<Image> = Vec::new();
//
//     while let Some(field) = payload.next().await {
//         let field = match field {
//             Ok(field) => field,
//             Err(err) => return HttpResponse::BadRequest().body(format!("Error processing field:recr {}", err))
//         };
//
//         let Some(field_name) = field.content_disposition().get_name() else {
//             return HttpResponse::BadRequest().body("Field has no name");
//         };
//
//         match field_name {
//             "image" => {
//                 match extract_image_from_field(field).await {
//                     Ok(image) => images.push(image),
//                     Err(err) => return HttpResponse::BadRequest().body(err),
//                 }
//             }
//             "description" => {
//                 match extract_string_from_field(field).await {
//                     Ok(desc) => record.description = Some(desc),
//                     Err(err) => return HttpResponse::BadRequest().body(err),
//                 }
//             }
//             "latitude" => {
//                 match extract_f64_from_field(field).await {
//                     Ok(lat) => marker.latitude = lat,
//                     Err(err) => return HttpResponse::BadRequest().body(err),
//                 }
//             }
//             "longitude" => {
//                 match extract_f64_from_field(field).await {
//                     Ok(long) => marker.longitude = long,
//                     Err(err) => return HttpResponse::BadRequest().body(err),
//                 }
//             }
//             _ => return HttpResponse::BadRequest().body("Unexpected field name"),
//         }
//     }
//
//     let marker_id = match insert_marker(&pool, marker).await {
//         Ok(id) => id,
//         Err(err) => {
//             eprintln!("{err}");
//             return HttpResponse::InternalServerError().body("Database error");
//         }
//     };
//
//     record.id = marker_id;
//     if let Err(err) = insert_record(&pool, record).await {
//         eprintln!("{err}");
//         return HttpResponse::InternalServerError().body("Database error");
//     }
//
//     for image in images {
//         if let Err(err) = insert_record_image(&pool, image, marker_id).await {
//             eprintln!("{err}");
//             return HttpResponse::InternalServerError().body("Database error");
//         }
//     }
//
//     HttpResponse::Ok().body("Data received")
// }

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


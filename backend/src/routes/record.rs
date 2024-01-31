use actix_multipart::Multipart;
use actix_web::{get, HttpRequest, HttpResponse, post, Responder, web};
use futures_util::StreamExt;
use sqlx::MySqlPool;
use crate::field_extractors::{extract_f64_from_field, extract_image_from_field, extract_string_from_field};
use crate::image::Image;
use crate::marker::{insert_marker, Marker};
use crate::record;
use crate::record::html::record_view_html;
use crate::record::Record;
use crate::user_error::UserError;

#[post("api/records")]
pub async fn post_record(mut payload: Multipart, pool: web::Data<MySqlPool>) -> impl Responder {
    let pool = pool.get_ref();

    let mut marker = Marker::new();
    let mut record = Record::new();
    let mut images: Vec<Image> = Vec::new();

    while let Some(field) = payload.next().await {
        let field = match field {
            Ok(field) => field,
            Err(err) => return HttpResponse::BadRequest().body(format!("Error processing field: {}", err))
        };

        let Some(field_name) = field.content_disposition().get_name() else {
            return HttpResponse::BadRequest().body("Field has no name");
        };

        match field_name {
            "image" => {
                match extract_image_from_field(field).await {
                    Ok(image) => images.push(image),
                    Err(err) => return HttpResponse::BadRequest().body(err),
                }
            }
            "description" => {
                match extract_string_from_field(field).await {
                    Ok(desc) => record.description = Some(desc),
                    Err(err) => return HttpResponse::BadRequest().body(err),
                }
            }
            "latitude" => {
                match extract_f64_from_field(field).await {
                    Ok(lat) => marker.latitude = lat,
                    Err(err) => return HttpResponse::BadRequest().body(err),
                }
            }
            "longitude" => {
                match extract_f64_from_field(field).await {
                    Ok(long) => marker.longitude = long,
                    Err(err) => return HttpResponse::BadRequest().body(err),
                }
            }
            _ => return HttpResponse::BadRequest().body("Unexpected field name"),
        }
    }

    let marker_id = match insert_marker(&pool, marker).await {
        Ok(id) => id,
        Err(err) => {
            eprintln!("{err}");
            return HttpResponse::InternalServerError().body("Database error");
        }
    };

    record.id = marker_id;
    if let Err(err) = insert_record(&pool, record).await {
        eprintln!("{err}");
        return HttpResponse::InternalServerError().body("Database error");
    }

    for image in images {
        if let Err(err) = insert_record_image(&pool, image, marker_id).await {
            eprintln!("{err}");
            return HttpResponse::InternalServerError().body("Database error");
        }
    }

    HttpResponse::Ok().body("Data received")
}

#[get("api/marker={marker_id}/records")]
pub async fn get_records(request: HttpRequest, pool: web::Data<MySqlPool>, marker_id: web::Path<i32>) -> Result<impl Responder, UserError> {
    let marker_id = marker_id.into_inner();

    let records = record::database::get_records_by_marker_id(&pool, marker_id).await?;
    for record in records {}
        let images = sqlx::query_as!(Image, "SELECT images.id from images inner join records on records.marker_fk = record_fk WHERE record_fk = ?", record.id).fetch_all(pool.get_ref()).await?
    for row in result {
        record.photos.push(row.id);
    }

    if let Some(header) = request.headers().get("Accept") {
        if let Ok(value) = header.to_str() {
            if value.contains("application/json") {
                return HttpResponse::Ok().json(&record);
            } else {
                return HttpResponse::Ok().body(record_view_html(&record).into_string());
            }
        }
    }

    Ok(HttpResponse::BadRequest().body("Malformed request"))
}


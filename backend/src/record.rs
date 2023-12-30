use actix_multipart::Multipart;
use actix_web::{get, HttpResponse, post, Responder, web};
use futures_util::StreamExt;
use serde::Serialize;
use sqlx::{FromRow, MySqlPool};
use crate::image::Image;
use crate::marker::*;
use crate::field_extractors::*;

#[derive(Debug, FromRow, Serialize)]
struct Record {
    id: i32,
    description: Option<String>,
    photos: Vec<i32>,
}

impl Record {
    fn new() -> Self {
        Record {
            id: 0,
            description: None,
            photos: Vec::new(),
        }
    }
}


//TODO: sanitize inputs
#[get("api/record/marker={marker_id}")]
pub async fn get_record(pool: web::Data<MySqlPool>, id: web::Path<i32>) -> impl Responder {
    let mut record = Record::new();
    record.id = id.into_inner();
    match sqlx::query!("SELECT marker_fk as id, description from records WHERE marker_fk = ?", record.id).fetch_one(pool.get_ref()).await {
        Ok(result) => record.description = result.description,
        Err(err) => {
            eprintln!("{err}");
            return HttpResponse::NotFound().body("e"); //TODO e
        }
    };

    match sqlx::query!("SELECT id from images inner join records on records.marker_fk = record_fk WHERE record_fk = ?", record.id
).fetch_all(pool.get_ref()).await {
        Ok(result) => {
            for row in result {
                record.photos.push(row.id);
            }
        }
        Err(err) => {
            eprintln!("{err}");
            return HttpResponse::InternalServerError().body("Database error");
        }
    };

    match serde_json::to_string(&record) {
        Ok(result) => HttpResponse::Ok().body(result),
        Err(err) => HttpResponse::InternalServerError().body(format!("{err}")) //TODO: json error?
    }
}

//TODO: sanitize
#[post("api/record/upload")]
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

// let mut transaction = match pool.begin().await {
//     Ok(tran) => tran,
//     Err(err) => {
//         eprintln!("{err}");
//         return HttpResponse::InternalServerError().body("Database error");
//     }
// };

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

// match Err(err) = transaction.commit().await {
//     eprintln!("{err}");
//     return HttpResponse::InternalServerError().body("Database error");
// }

    HttpResponse::Ok().body("Data received")
}

async fn insert_record_image(pool: &sqlx::MySqlPool, image: Image, record_fk: i32) -> Result<(), sqlx::Error> {
    sqlx::query!("INSERT INTO images (record_fk, filename, image_data) VALUES (?, ?, ?)",
            record_fk, image.filename, image.image_data)
        .execute(pool).await?;
    Ok(())
}

async fn insert_record(pool: &sqlx::MySqlPool, record: Record) -> Result<(), sqlx::Error> {
    sqlx::query!("INSERT INTO records (marker_fk, description) VALUES (?, ?)",
        record.id,
        record.description).execute(pool).await?;
    Ok(())
}


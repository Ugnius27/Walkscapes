use std::fs::File;
use std::io::Read;
use futures_util::stream::StreamExt;
use sqlx::postgres::{PgPoolOptions, PgRow};
use sqlx::{FromRow, PgPool, Postgres, Row, Transaction};
use actix_web::{web, get, post, App, HttpServer, Responder, HttpMessage, HttpResponse, HttpRequest};
use serde::{Serialize, Deserialize};
use std::io::Write;
use std::str::FromStr;
use actix_multipart::{Multipart, Field};
use futures_util::TryStreamExt;
use serde::de::Unexpected::Float;


#[derive(Debug, FromRow, Serialize)]
struct Person {
    id: i32,
    name: String,
    age: i16,
}

#[derive(Debug, FromRow, Serialize)]
struct Image {
    id: i32,
    filename: String,
    image_data: Vec<u8>,
}

#[derive(Debug, FromRow, Serialize)]
struct RecordImage {
    record_fk: i32,
    id: i32,
    filename: String,
    image_data: Vec<u8>,
}

impl From<Image> for RecordImage {
    fn from(image: Image) -> RecordImage {
        RecordImage {
            record_fk: 0,
            id: image.id,
            filename: image.filename,
            image_data: image.image_data,
        }
    }
}

#[derive(Debug, FromRow, Serialize)]
struct Marker {
    id: i32,
    latitude: f64,
    longitude: f64,
}

impl Marker {
    fn new() -> Self {
        Marker {
            id: 0,
            latitude: 0.0,
            longitude: 0.0,
        }
    }
}

#[derive(Debug, FromRow, Serialize)]
struct Record {
    id: i32,
    description: Option<String>,
}

impl Record {
    fn new() -> Self {
        Record {
            id: 0,
            description: None,
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    const DATABASE_URL: &str = "postgres://testuser:slaptazodis@158.129.1.132/test";
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(DATABASE_URL).await?;

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .service(get_image)
            .service(get_people)
            .service(post_record)
            .service(actix_files::Files::new("/", "../frontend")
                .index_file("index.html"))
    })
        .bind("0.0.0.0:8080")
        .expect("Failed to bind server")
        .run()
        .await
        .expect("Failed to run server");

    Ok(())
}

#[get("api/people")]
async fn get_people(pool: web::Data<PgPool>) -> impl Responder {
    let people: Vec<Person> = sqlx::query_as!(Person, "SELECT * FROM people")
        .fetch_all(pool.get_ref()).await.expect("Nepavyko gauti duomenų iš DB");
    serde_json::to_string(&people).unwrap().to_string()
}

#[get("api/image/{name}")]
async fn get_image(name: web::Path<String>, pool: web::Data<PgPool>) -> impl Responder {
    let image = sqlx::query_as!(Image, "SELECT * FROM images WHERE filename = $1", name.into_inner())
        .fetch_one(pool.get_ref()).await;

    match image {
        Ok(image) => {
            HttpResponse::Ok()
                .content_type("image")
                .body(image.image_data)
        }
        Err(_) => HttpResponse::NotFound().body("Image not found"),
    }
}

#[post("api/record/upload")]
async fn post_record(req: HttpRequest, mut payload: Multipart, pool: web::Data<PgPool>) -> impl Responder {
    println!("Content-Type: {:?}", req.headers().get("Content-Type"));
    let pool = pool.get_ref();

    let mut marker = Marker::new();
    let mut record = Record::new();
    let mut images: Vec<Image> = Vec::new();

    while let Some(field) = payload.next().await {
        let mut field = match field {
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

async fn insert_record_image(pool: &sqlx::PgPool, image: Image, record_fk: i32) -> Result<(), sqlx::Error> {
    let result = sqlx::query!("INSERT INTO record_images (record_fk, filename, image_data) VALUES ($1, $2, $3)",
            record_fk, image.filename, image.image_data)
        .execute(pool).await?;
    Ok(())
}

async fn insert_record(pool: &sqlx::PgPool, record: Record) -> Result<(), sqlx::Error> {
    let result = sqlx::query!("INSERT INTO records (marker_fk, description) VALUES ($1, $2)",
        record.id,
        record.description).execute(pool).await?;
    Ok(())
}

async fn insert_marker(pool: &sqlx::PgPool, marker: Marker) -> Result<i32, sqlx::Error> {
    let result = sqlx::query!("INSERT INTO markers (coordinates) VALUES (ST_MakePoint($1, $2)) RETURNING id",
        marker.latitude,
        marker.longitude).fetch_one(pool).await?;
    Ok(result.id)
}


async fn extract_bytes_from_field(mut field: Field) -> Result<Vec::<u8>, &'static str> {
    let mut bytes = Vec::new();
    while let Some(chunk) = field.next().await {
        bytes.extend_from_slice(&chunk.map_err(|_| "Problem processing payload")?);
    }
    Ok(bytes)
}

async fn extract_image_from_field(mut field: Field) -> Result<Image, &'static str> {
    let filename = field.content_disposition()
        .get_filename()
        .ok_or("Malformed field in multipart")? //Not sure if this check is necessary
        .to_owned();
    let bytes = extract_bytes_from_field(field).await?;
    Ok(Image {
        id: 0,
        filename: filename,
        image_data: bytes,
    })
}

async fn extract_string_from_field(mut field: Field) -> Result<String, &'static str> {
    let bytes = extract_bytes_from_field(field).await?;
    Ok(String::from_utf8(bytes).map_err(|_| "String in multipart was not UTF8")?)
}

async fn extract_f64_from_field(mut field: Field) -> Result<f64, &'static str> {
    let bytes = extract_bytes_from_field(field).await?;
    unsafe {
        match f64::from_str(&String::from_utf8_unchecked(bytes)) {
            Ok(f) => Ok(f),
            Err(_) => Err("Failed to parse float in multipart"),
        }
    }
}
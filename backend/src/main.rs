use std::fs::File;
use std::io::Read;
use futures_util::stream::StreamExt;
use sqlx::postgres::{PgPoolOptions, PgRow};
use sqlx::{FromRow, PgPool, Postgres, Row};
use actix_web::{web, App, HttpServer, Responder, HttpMessage, HttpResponse, HttpRequest};
use serde::{Serialize, Deserialize};
use std::io::Write;
use actix_multipart::Multipart;
use futures_util::TryStreamExt;


#[derive(Debug, FromRow, Serialize)]
struct Person {
    id: i32,
    name: String,
    age: i16,
}

#[derive(Debug, FromRow, Serialize)]
struct Image {
    id: i32,
    name: String,
    image_data: Vec<u8>,
}

#[derive(Debug, FromRow, Serialize)]
struct Record {
    id: i32,
    latitude: f64,
    longitude: f64,
    description: String,
    images_fk: i32,
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
            .service(web::resource("api/people").to(get_people))
            .service(web::resource("api/image/{name}").route(web::get().to(get_image)))
            .service(web::resource("api/record/upload").route(web::post().to(post_record)))
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

async fn get_people(pool: web::Data<PgPool>) -> impl Responder {
    let people: Vec<Person> = sqlx::query_as!(Person, "SELECT * FROM people")
        .fetch_all(pool.get_ref()).await.expect("Nepavyko gauti duomenų iš DB");
    serde_json::to_string(&people).unwrap().to_string()
}

async fn get_image(name: web::Path<String>, pool: web::Data<PgPool>) -> impl Responder {
    let image = sqlx::query_as!(Image, "SELECT * FROM images WHERE name = $1", name.into_inner())
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

async fn post_record(req: HttpRequest, mut payload: Multipart, pool: web::Data<PgPool>) -> impl Responder {
    println!("Content-Type: {:?}", req.headers().get("Content-Type"));
    let pool = pool.get_ref();
    let mut record = Record {
        id: 0,
        latitude: 0.0,
        longitude: 0.0,
        description: String::new(),
        images_fk: 0,
    };
    let mut images: Vec<Image> = Vec::new();

    while let Some(field) = payload.next().await {
        let mut field = match field {
            Ok(field) => field,
            Err(err) => return HttpResponse::BadRequest().body(format!("Error processing field: {}", err))
        };

        let mut bytes = Vec::new();
        while let Some(chunk) = field.next().await {
            bytes.extend_from_slice(&chunk.unwrap());
        }
        let field_name = field.content_disposition().get_name().unwrap();

        match field_name {
            "image" => {
                let image = Image {
                    id: 0,
                    name: field.content_disposition().get_filename().unwrap().to_owned(),
                    image_data: bytes,
                };
                images.push(image);
            }
            "description" => {}
            "latitude" => {}
            "longitude" => {}
            _ => {}
        }
    }
    if !images.is_empty() {
        for image in images {
            sqlx::query!("INSERT INTO images (name, image_data) VALUES ($1, $2)",
            image.name, image.image_data).execute(pool).await.unwrap();
        }
    }
    HttpResponse::Ok().body("Data received successfully!")
}
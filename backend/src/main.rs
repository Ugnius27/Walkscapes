use std::fs::File;
use std::io::Read;
use sqlx::postgres::{PgPoolOptions, PgRow};
use sqlx::{FromRow, PgPool, Postgres, Row};
use actix_web::{web, App, HttpServer, Responder, HttpMessage, HttpResponse};
use serde::{Serialize, Deserialize};


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

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    const DATABASE_URL: &str = "postgres://testuser:slaptazodis@158.129.1.132/test";
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(DATABASE_URL).await?;

    // let mut data = Vec::new();
    // File::open("Cat.jpg").unwrap().read_to_end(&mut data).ok();
    // sqlx::query!("INSERT INTO images (name, image_data) VALUES ($1, $2)",
    //     "cat.jpg".to_string(), data).execute(&pool).await.unwrap();

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(actix_cors::Cors::default())
            .service(web::resource("api/people").to(get_people))
            .service(web::resource("api/test").to(test))
            .service(web::resource("api/image/{name}").route(web::get().to(get_image)))
            .service(actix_files::Files::new("/", "./frontend")
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

async fn test() -> impl Responder {
    "Test"
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
mod record;
mod marker;
mod image;
mod field_extractors;
mod challenge;
mod polygon;

use sqlx::{MySqlPool};
use actix_web::{web, App, HttpServer};
use std::env;
use actix_cors::Cors;
use crate::record::{get_record, post_record};
use crate::marker::get_markers;
use crate::challenge::{get_challenges};
use crate::image::get_record_image;


#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    dotenv::dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("URL error");
    let pool = match MySqlPool::connect(&database_url).await {
        Ok(pool) => pool,
        Err(err) => {
            eprintln!("{err}");
            panic!();
        }
    };

    HttpServer::new(move || {
        App::new()
            .wrap(Cors::permissive())////////////////////////////
            .app_data(web::Data::new(pool.clone()))
            .service(post_record)
            .service(get_markers)
            .service(get_challenges)
            .service(get_record)
            .service(get_record_image)
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
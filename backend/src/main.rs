mod record;
mod marker;
mod image;
mod field_extractors;
mod challenge;
mod polygon;
mod user_error;
mod tls;

use sqlx::{MySqlPool};
use actix_web::{web, App, HttpServer};
use std::env;
use std::fs::File;
use std::io::BufReader;
use actix_cors::Cors;
use crate::record::{get_record, post_record};
use crate::marker::get_markers;
use crate::challenge::*;
use crate::image::get_record_image;
use crate::polygon::{delete_polygon, get_polygon, get_polygons, post_polygon};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    //Paths
    dotenv::dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DB URL nor found");

    //DB
    let pool = MySqlPool::connect(&database_url).await?;

    //Server
    HttpServer::new(move || {
        App::new()
            .wrap(Cors::permissive())
            .app_data(web::Data::new(pool.clone()))
            .service(post_record)
            .service(get_markers)
            .service(get_challenges)
            .service(get_challenge_edit_form)
            .service(put_challenge)
            .service(delete_challenge)
            .service(get_challenge)
            .service(get_record)
            .service(get_record_image)
            .service(post_challenge)
            .service(post_polygon)
            .service(delete_polygon)
            .service(get_polygons)
            .service(get_polygon)
            .service(actix_files::Files::new("/", "../frontend")
                .index_file("index.html"))
    })
        .bind("0.0.0.0:8080").expect("Failed to bind HTTP")
        //TLS
        // .bind_rustls_021("0.0.0.0:8443", tls::load_rustls_config()).expect("Failed to bind HTTPS")
        .run()
        .await.unwrap();

    //Done
    Ok(())
}
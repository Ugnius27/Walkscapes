mod tls;
mod models;
mod routes;
mod markup;

use sqlx::MySqlPool;
use actix_web::{web, App, HttpServer};
use std::env;
use actix_cors::Cors;
use crate::routes::{
    record,
    challenge,
    polygon,
    marker,
};

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
            .service(marker::get_markers)
            .service(record::get_records)
            .service(record::post_record)
            .service(challenge::get_challenges)
            .service(challenge::get_challenge_edit_form)
            .service(challenge::put_challenge)
            .service(challenge::delete_challenge)
            .service(challenge::get_challenge)
            .service(challenge::post_challenge)
            .service(get_record_image)
            .service(polygon::post_polygon)
            .service(polygon::delete_polygon)
            .service(polygon::get_polygons)
            .service(polygon::get_polygon_by_id)
            .service(actix_files::Files::new("/", "../frontend")
                .index_file("index.html"))
    })
        .bind("0.0.0.0:8080").expect("Failed to bind HTTP")
        //TLS
        .bind_rustls_021("0.0.0.0:8443", tls::load_rustls_config()).expect("Failed to bind HTTPS")
        .run()
        .await.unwrap();

    //Done
    Ok(())
}
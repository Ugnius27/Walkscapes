mod tls;
mod models;
mod routes;
mod markup;

use sqlx::MySqlPool;
use actix_web::{web, App, HttpServer};
use std::env;
use actix_cors::Cors;
use crate::routes::{json_api, ui_components};
use json_api::*;
use ui_components::challenge_list;
use crate::routes::ui_components::polygon_editor;

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
            .service(marker::get_marker_records)

            .service(record::get_records)
            .service(record::post_record)

            .service(challenge::get_challenges)

            .service(polygon::get_polygons)

            .service(polygon_editor::post_polygon)
            .service(polygon_editor::delete_polygon)
            .service(polygon_editor::get_polygon_by_id)

            .service(challenge_list::get_challenges)
            .service(challenge_list::get_selected_challenge)
            .service(challenge_list::get_challenge_edit_form)
            .service(challenge_list::put_challenge)
            .service(challenge_list::delete_challenge)
            .service(challenge_list::post_challenge)

            .service(actix_files::Files::new("/", "../frontend")
                .index_file("index.html"))
    })
        .bind("0.0.0.0:8080").expect("Failed to bind HTTP")
        .bind_rustls_021("0.0.0.0:8443", tls::load_rustls_config()).expect("Failed to bind HTTPS")
        .run()
        .await.unwrap();

    //Done
    Ok(())
}
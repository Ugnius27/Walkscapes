mod tls;
mod models;
mod routes;
mod markup;
mod utils;

use sqlx::MySqlPool;
use actix_web::{web, App, HttpServer};
use std::env;
use actix_cors::Cors;
use crate::routes::{json_api, admin_panel::*, admin_panel};
use json_api::*;
use ui_components::challenge_list;
use admin_panel::ui_components::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    //Paths
    dotenv::dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DB URL nor found");

    //DB
    let pool = MySqlPool::connect(&database_url).await?;

    //Admin
    let admin_password = env::var("ADMIN_PASSWORD").expect("Admin password not set");

    //Server
    HttpServer::new(move || {
        App::new()
            .wrap(Cors::permissive())
            .app_data(web::Data::new(pool.clone()))
            .app_data(web::Data::new(admin_password.clone()))

            .service(marker::get_markers)
            .service(marker::get_marker_records)

            .service(record::get_records)
            .service(record::post_record)

            .service(image::get_image_by_id)

            .service(challenge::get_challenges)

            .service(polygon::get_polygons)

            .service(login::get_login_form)
            .service(login::post_login_form)
            .service(login::admin_redirect)

            .service(polygon_editor::post_polygon)
            .service(polygon_editor::delete_polygon)
            .service(polygon_editor::get_polygon_by_id)

            .service(challenge_list::get_challenges)
            .service(challenge_list::get_selected_challenge)
            .service(challenge_list::get_challenge_edit_form)
            .service(challenge_list::put_challenge)
            .service(challenge_list::delete_challenge)
            .service(challenge_list::post_challenge)

            .service(record_viewer::get_records)
            .service(record_viewer::get_record)
            .service(record_viewer::delete_record)
            .service(record_viewer::delete_marker)

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
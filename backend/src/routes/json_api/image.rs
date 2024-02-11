use actix_web::{get, HttpResponse, Responder, web};
use sqlx::MySqlPool;
use crate::routes::user_error::UserError;
use crate::models::database::image;

#[get("api/images/{image_id}")]
pub async fn get_image_by_id(pool: web::Data<MySqlPool>, path: web::Path<i32>) -> Result<impl Responder, UserError> {
    let image_id = path.into_inner();
    let image = image::get_image_by_id(&pool, image_id).await?;

    Ok(HttpResponse::Ok()
        .content_type("image")
        .body(image.image_data))
}
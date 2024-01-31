use actix_web::{get, HttpResponse, Responder, web};
use sqlx::MySqlPool;
use crate::routes::user_error::UserError;
use crate::models::database::image;

//todo
#[get("api/marker={marker_id}/mage={image_id}")]
pub async fn get_image(pool: web::Data<MySqlPool>, path: web::Path<(i32, i32)>) -> Result<impl Responder, UserError> {
    let (record_id, image_id) = path.into_inner();
    let image = image::get_image_by_id(&pool, record_id, image_id).await?;

    Ok(HttpResponse::Ok()
        .content_type("image")
        .body(image.image_data))
}

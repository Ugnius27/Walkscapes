use actix_web::{get, HttpResponse, Responder, web};
use sqlx::MySqlPool;
use crate::models::database::marker;
use crate::routes::user_error::UserError;

#[get("api/markers")]
pub async fn get_markers(pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    let markers = marker::get_markers_with_records(&pool).await?;
    Ok(HttpResponse::Ok().json(markers))
}

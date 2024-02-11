use actix_web::{delete, get, HttpResponse, post, Responder, web};
use sqlx::MySqlPool;
use crate::models::Polygon;
use crate::routes::user_error::UserError;
use crate::models::database::polygon;
use crate::markup::polygon_editor::polygon_to_html;

#[get("api/polygons")]
pub async fn get_polygons(pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    let pool = pool.get_ref();
    let polygons = polygon::get_polygons(&pool).await.map_err(|_| UserError::Internal)?; //todo not internal
    Ok(HttpResponse::Ok().json(polygons))
}


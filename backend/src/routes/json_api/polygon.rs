use actix_web::{delete, get, HttpResponse, post, Responder, web};
use sqlx::MySqlPool;
use crate::models::Polygon;
use crate::routes::user_error::UserError;
use crate::models::database::polygon;
use crate::markup::polygon_modal::polygon_to_html;

#[get("api/polygons")]
pub async fn get_polygons(pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    let pool = pool.get_ref();
    let polygons = polygon::get_polygons(&pool).await.map_err(|_| UserError::Internal)?; //todo
    Ok(HttpResponse::Ok().json(polygons))
}

#[get("api/polygons/{id}")]
pub async fn get_polygon_by_id(path: web::Path<i32>, pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    let polygon_id = path.into_inner();
    let polygon = polygon::get_polygon_by_id(&pool.get_ref(), polygon_id).await.map_err(|_| UserError::Internal)?;
    Ok(HttpResponse::Ok().body(polygon_to_html(&polygon).into_string()))
}

#[delete("api/polygons/{id}")]
async fn delete_polygon(id: web::Path<i32>, pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    polygon::delete_polygon_by_id(id.into_inner(), pool.get_ref()).await?;
    Ok(HttpResponse::Ok().body(""))
}

#[post("api/polygons")]
async fn post_polygon(polygon: web::Json<Polygon>, pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    let polygon_id = polygon::insert_polygon(polygon.0, pool.get_ref()).await?;
    Ok(web::Json(polygon_id))
}

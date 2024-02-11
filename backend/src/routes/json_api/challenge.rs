use std::iter::zip;
use actix_web::{get, Responder, web};
use sqlx::MySqlPool;
use crate::models::database::{challenge, polygon};
use crate::routes::user_error::UserError;


#[get("api/challenges")]
pub async fn get_challenges(pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    let challenges = challenge::get_challenges(&pool).await?;

    let mut challenges_polygons = Vec::with_capacity(challenges.len());
    for challenge in challenges.iter() {
        let polygon = polygon::get_polygon_by_id(&pool, challenge.polygon_id)
            .await
            .map_err(|e| UserError::Internal)?; //todo not internal
        challenges_polygons.push(polygon);
    }

    let complete_challenges = zip(challenges, challenges_polygons)
        .map(|(challenge, challenge_polygon)|
            serde_json::json!({
                "id": challenge.id,
                "title": challenge.title,
                "description": challenge.description,
                "polygon": challenge_polygon,
                "is_active": challenge.is_active,
                "is_visible": challenge.is_visible,
        }))
        .collect::<Vec<serde_json::Value>>();
    Ok(web::Json(complete_challenges))
}

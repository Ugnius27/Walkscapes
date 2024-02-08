use actix_web::{get, post, HttpResponse, Responder, web, HttpRequest, delete, put};
use maud::Markup;
use sqlx::MySqlPool;
use crate::markup::challenge_list::{challenge_title_tile, challenges_index, edit_challenge_form, challenges_index_selected};
use crate::models::Challenge;
use crate::models::challenge::{ChallengePostForm};
use crate::models::database::challenge;
use crate::routes::user_error::UserError;

#[get("api/challenges")]
pub async fn get_challenges(pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    let pool = pool.get_ref();
    let challenges = challenge::get_challenges(&pool).await?;
    Ok(web::Json(challenges))
}

#[get("api/challenges/{id}")]
pub async fn get_challenge(id: web::Path<i32>, pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    let challenges = challenge::get_challenges(&pool).await?;
    Ok(challenges_index_selected(&challenges, id.into_inner()))
}

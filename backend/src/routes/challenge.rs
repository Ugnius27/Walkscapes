use actix_web::{get, post, HttpResponse, Responder, web, HttpRequest, delete, put};
use maud::Markup;
use sqlx::MySqlPool;
use crate::markup::challenge::{challenge_tile_html, challenges_index_html, edit_form_html, read_challenge_html};
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

//move out
#[get("api/challenges/{id}")]
pub async fn get_challenge(id: web::Path<i32>, pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    let challenges = challenge::get_challenges(&pool).await?;
    Ok(read_challenge_html(&challenges, id.into_inner()))
}

#[post("api/challenges")]
pub async fn post_challenge(web::Form(form): web::Form<ChallengePostForm>, pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    let pool = pool.get_ref();

    let challenge: Challenge = form.into();
    challenge::insert_challenge(&challenge, pool).await?;

    let challenges = challenge::get_challenges(pool).await?;
    let response = challenges_index_html(&challenges).into_string();
    Ok(HttpResponse::Ok().body(response))
}

//move out
#[put("api/challenges/{id}")]
pub async fn put_challenge(web::Form(form): web::Form<ChallengePostForm>, id: web::Path<i32>, pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    let pool = pool.get_ref();
    let old_challenge = challenge::get_challenge_by_id(id.into_inner(), &pool).await?;

    let mut challenge: Challenge = form.into();
    challenge.id = old_challenge.id;

    challenge::update_challenge(&challenge, &pool).await?;

    Ok(challenge_tile_html(&challenge))
}

#[delete("api/challenges/{id}")]
pub async fn delete_challenge(challenge_id: web::Path<i32>, pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    challenge::delete_challenge_by_id(challenge_id.into_inner(), pool.get_ref()).await?;
    Ok(HttpResponse::Ok().body(""))
}

//move out
#[get("api/challenges/{id}/edit")]
pub async fn get_challenge_edit_form(challenge_id: web::Path<i32>, pool: web::Data<MySqlPool>) -> Result<Markup, UserError> {
    let challenge = challenge::get_challenge_by_id(challenge_id.into_inner(), pool.get_ref()).await?;
    Ok(edit_form_html(&challenge))
}






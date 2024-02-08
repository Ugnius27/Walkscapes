use actix_web::{delete, get, HttpResponse, post, put, Responder, web};
use maud::Markup;
use sqlx::MySqlPool;
use crate::markup::challenge_list::*;
use crate::models::Challenge;
use crate::models::challenge::ChallengePostForm;
use crate::models::database::challenge;
use crate::routes::user_error::UserResult;


#[get("admin/challenges-list")]
pub async fn get_challenges(pool: web::Data<MySqlPool>) -> UserResult<Markup> {
    let challenges = challenge::get_challenges(&pool).await?;
    Ok(challenges_index(&challenges))
}

#[get("admin/challenges-list/{challenge_id}")]
pub async fn get_selected_challenge(path: web::Path<i32>, pool: web::Data<MySqlPool>) -> UserResult<Markup> {
    let challenges = challenge::get_challenges(&pool).await?;
    Ok(challenges_index_selected(&challenges, path.into_inner()))
}

#[get("admin/challenges-list/{id}/edit")]
pub async fn get_challenge_edit_form(path: web::Path<i32>, pool: web::Data<MySqlPool>) -> UserResult<Markup> {
    let challenge = challenge::get_challenge_by_id(path.into_inner(), &pool).await?;
    Ok(edit_challenge_form(&challenge))
}

#[post("admin/challenges-list")]
pub async fn post_challenge(web::Form(form): web::Form<ChallengePostForm>,
                            pool: web::Data<MySqlPool>)
                            -> UserResult<Markup> {
    let challenge: Challenge = form.into();
    challenge::insert_challenge(&challenge, &pool).await?;
    let challenges = challenge::get_challenges(&pool).await?;
    Ok(challenges_index(&challenges))
}

#[put("admin/challenges-list/{challenge_id}")]
pub async fn put_challenge(web::Form(form): web::Form<ChallengePostForm>,
                           path: web::Path<i32>,
                           pool: web::Data<MySqlPool>)
                           -> UserResult<impl Responder> {
    let old_challenge = challenge::get_challenge_by_id(path.into_inner(), &pool).await?;
    let mut challenge: Challenge = form.into();
    challenge.id = old_challenge.id;
    challenge::update_challenge(&challenge, &pool).await?;
    Ok(challenge_title_tile(&challenge))
}

#[delete("admin/challenges-list/{challenge_id}")]
pub async fn delete_challenge(path: web::Path<i32>, pool: web::Data<MySqlPool>) -> UserResult<impl Responder> {
    challenge::delete_challenge_by_id(path.into_inner(), pool.get_ref()).await?;
    Ok(HttpResponse::Ok().body(""))
}

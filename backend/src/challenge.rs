mod database;
mod html;

use actix_web::{get, post, HttpResponse, Responder, web, HttpRequest, delete, put};
use maud::Markup;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, MySqlPool};
use crate::marker::Marker;
use crate::polygon::Polygon;
use crate::challenge::database::*;
use crate::challenge::html::*;


#[derive(Debug, FromRow, Serialize, Deserialize, Clone)]
pub struct Challenge {
    pub id: Option<i32>,
    pub title: String,
    pub description: String,
    pub polygon: Polygon,
    pub markers: Vec<Marker>,
    pub is_active: bool,
}

impl From<ChallengePostForm> for Challenge {
    fn from(value: ChallengePostForm) -> Self {
        Challenge {
            id: None,
            title: value.title,
            description: value.description,
            polygon: Polygon {
                id: Some(value.polygon_id),
                vertices: None,
            },
            markers: Vec::new(),
            is_active: if value.is_active == "on" { true } else { false },
        }
    }
}

#[derive(Debug, FromRow, Serialize, Deserialize)]
struct ChallengePostForm {
    title: String,
    description: String,
    polygon_id: i32,
    #[serde(default)]
    is_active: String,
}


#[delete("api/challenges/{id}")]
pub async fn delete_challenge(id: web::Path<i32>, pool: web::Data<MySqlPool>) -> impl Responder {
    match delete_challenge_from_db(id.into_inner(), pool.get_ref()).await {
        Ok(_) => HttpResponse::Ok().body(""),
        Err(err) => HttpResponse::Conflict().body(format!("{err}")),
    }
}

#[get("api/challenges/{id}/edit")]
pub async fn get_challenge_edit_form(id: web::Path<i32>, pool: web::Data<MySqlPool>) -> actix_web::Result<Markup> {
    let challenge = get_challenge_from_db(id.into_inner(), pool.get_ref()).await?;
    Ok(edit_form_html(&challenge))
}


#[put("api/challenges/{id}")]
pub async fn put_challenge(web::Form(form): web::Form<ChallengePostForm>, id: web::Path<i32>, pool: web::Data<MySqlPool>) -> impl Responder {
    let pool = pool.get_ref();
    let old_challenge_id = match get_challenge_from_db(id.into_inner(), &pool).await {
        Ok(challenge) => challenge.id,
        Err(err) => return HttpResponse::InternalServerError().body(format!("{err}")),
    };

    let mut challenge: Challenge = form.into();
    challenge.id = old_challenge_id;

    match edit_challenge_in_db(challenge.clone(), &pool).await {
        Ok(_) => {
            let response = challenge_tile_html(&challenge).into_string();
            return HttpResponse::Ok().body(response);
        }
        Err(err) => HttpResponse::InternalServerError().body(format!("{err}")),
    }
}

#[get("api/challenges")]
pub async fn get_challenges(request: HttpRequest, pool: web::Data<MySqlPool>) -> impl Responder {
    let challenges = match get_challenges_from_db(pool.get_ref()).await {
        Ok(val) => val,
        Err(err) => {
            eprintln!("{err}");
            return HttpResponse::InternalServerError().body(format!("{err}"));
        }
    };

    if let Some(header) = request.headers().get("Accept") {
        if let Ok(value) = header.to_str() {
            if value.contains("application/json") {
                return HttpResponse::Ok().json(&challenges);
            } else {
                return HttpResponse::Ok().body(challenges_index_html(&challenges).into_string());
            }
        }
    }
    return HttpResponse::BadRequest().body("Malformed request");
}

#[get("api/challenges/{id}")]
pub async fn get_challenge(id: web::Path<i32>, pool: web::Data<MySqlPool>) -> actix_web::Result<Markup> {
    let challenges = get_challenges_from_db(&pool).await?;
    Ok(read_challenge_html(&challenges, id.into_inner()))
}

#[post("api/challenges")]
pub async fn post_challenge(web::Form(form): web::Form<ChallengePostForm>, pool: web::Data<MySqlPool>) -> impl Responder {
    let pool = pool.get_ref();
    let challenge: Challenge = form.into();

    match add_challenge_to_db(challenge, pool).await {
        Ok(_) => {}
        Err(err) => {
            eprintln!("{err}");
            return HttpResponse::InternalServerError().body(format!("{err}"));
        }
    };

    let challenges = match get_challenges_from_db(pool).await {
        Ok(ok) => ok,
        Err(err) => {
            eprintln!("{err}");
            return HttpResponse::InternalServerError().body(format!("{err}"));
        }
    };

    let response = challenges_index_html(&challenges).into_string();
    HttpResponse::Ok().body(response)
}


use actix_web::{get, post, HttpResponse, Responder, web, HttpRequest, delete, put};
use maud::Markup;
use sqlx::MySqlPool;
use crate::routes::user_error::user_error::UserError;
mod crate::models:: {
    pub mod challenge {
        mod database
    }
}

#[delete("api/challenges/{id}")]
pub async fn delete_challenge(challenge_id: web::Path<i32>, pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    Ok(delete_challenge_from_db(challenge_id.into_inner(), pool.get_ref()).await?);
}

#[get("api/challenges/{id}/edit")]
pub async fn get_challenge_edit_form(challenge_id: web::Path<i32>, pool: web::Data<MySqlPool>) -> Result<Markup, UserError> {
    let challenge = get_challenge_from_db(challenge_id.into_inner(), pool.get_ref()).await?;
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

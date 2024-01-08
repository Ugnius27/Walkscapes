use actix_web::{get, post, HttpResponse, Responder, web, HttpRequest, delete};
use maud::Markup;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, MySqlPool};
use crate::marker::Marker;
use crate::polygon::Polygon;
use crate::challenge_templates::*;


#[derive(Debug, FromRow, Serialize, Deserialize)]
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
    is_active: String,
}

// impl Challenge {
//     fn new() -> Self {
//         Challenge {
//             id: None,
//             title: String::new(),
//             description: String::new(),
//             markers: Vec::new(),
//             polygon: Polygon::new(),
//         }
//     }
// }

async fn get_challenges_from_db(pool: &MySqlPool) -> Result<Vec<Challenge>, Box<dyn std::error::Error>> {
    let rows = sqlx::query!(
        r#"SELECT
        c.id, c.title, c.description, c.is_active,
        p.id as polygon_id,
        JSON_EXTRACT(ST_AsGeoJSON(p.vertices), '$.coordinates[0]') AS vertices
        FROM challenges as c
        INNER JOIN polygons as p ON p.id = c.polygon_id;"#)
        .fetch_all(pool).await?;

    let mut challenges = Vec::new();
    for row in rows {
        let markers = sqlx::query_as!(
            Marker,
            r#"SELECT m.id, m.latitude, m.longitude FROM markers as m
            INNER JOIN challenge_markers as c_m
            ON m.id = c_m.marker_id
            WHERE c_m.challenge_id = ?;"#, row.id)
            .fetch_all(pool).await?;

        let vertices = row.vertices.ok_or_else(|| String::from("Error parsing polygon vertices from database"))?;
        let vertices: Vec<(f64, f64)> = serde_json::from_value(vertices)?;
        challenges.push(Challenge {
            id: Some(row.id),
            title: row.title,
            description: row.description,
            markers,
            polygon: Polygon {
                id: Some(row.polygon_id),
                vertices: Some(vertices),
            },
            is_active: if row.is_active == 0 { false } else { true }, //todo bandaid
        });
    }
    Ok(challenges)
}

async fn add_challenge_to_db(challenge: Challenge, pool: &MySqlPool) -> Result<i32, Box<dyn std::error::Error>> {
    let result = sqlx::query!(
        r#"INSERT INTO
           challenges (title, description, polygon_id, is_active)
           values (?, ?, ?, ?);"#,
        challenge.title,
        challenge.description,
        challenge.polygon.id,
        challenge.is_active
    ).execute(pool).await?;
    Ok(result.last_insert_id() as i32)
}

async fn delete_challenge_from_db(challenge_id: i32, pool: &MySqlPool) -> Result<(), Box<dyn std::error::Error>> {
    sqlx::query!(r#"
    DELETE FROM challenges
    WHERE id = ?"#, challenge_id).execute(pool).await?;
    Ok(())
}

#[delete("api/challenges/{id}")]
pub async fn delete_challenge(id: web::Path<i32>, pool: web::Data<MySqlPool>) -> impl Responder {
    match delete_challenge_from_db(id.into_inner(), pool.get_ref()).await {
        Ok(_) => HttpResponse::Ok().body(""),
        Err(err) => HttpResponse::Conflict().body(format!("{err}")),
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


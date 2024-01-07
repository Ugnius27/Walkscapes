use actix_web::{get, post, HttpResponse, Responder, web, HttpRequest};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, MySqlPool};
use crate::marker::Marker;
use crate::polygon::Polygon;
use maud::*;

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Challenge {
    id: Option<i32>,
    title: String,
    description: String,
    polygon: Polygon,
    markers: Vec<Marker>,
    is_active: bool,
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
            WHERE c_m.challenge_id = ?"#, row.id)
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
                return HttpResponse::Ok().body(challenges_to_html(challenges));
            }
        }
    }
    return HttpResponse::BadRequest().body("Malformed request");
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

    let response = challenges_to_html(challenges);
    HttpResponse::Ok().body(response)
}

fn challenges_to_html(challenges: Vec<Challenge>) -> String {
    let html = html! {
        ul {
            li.button hx-get=("new_challenge.html") hx-swap=("outerHTML") {("CREATE NEW CHALLENGE")}
            @for challenge in challenges {
                li.button onclick=("test()") {(challenge.title)}
            }
        }
    }.into_string();
    html
}

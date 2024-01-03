use actix_web::{get, post, put, HttpResponse, Responder, web};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, MySqlPool};
use crate::marker::Marker;
use crate::polygon::Polygon;

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Challenge {
    id: i32,
    title: String,
    description: String,
    polygon: Polygon,
    markers: Vec<Marker>,
}

impl Challenge {
    fn new() -> Self {
        Challenge {
            id: 0,
            title: String::new(),
            description: String::new(),
            markers: Vec::new(),
            polygon: Polygon::new(),
        }
    }
}

#[get("api/challenges")]
pub async fn get_challenges(pool: web::Data<MySqlPool>) -> impl Responder {
    let pool = pool.get_ref();
    let rows = match sqlx::query!(
        r#"SELECT
        c.id, c.title, c.description,
        p.id as polygon_id,
        JSON_EXTRACT(ST_AsGeoJSON(p.vertices), '$.coordinates[0]') AS vertices
        FROM challenges as c
        INNER JOIN polygons as p ON p.id = c.polygon_id;"#)
        .fetch_all(pool).await {
        Ok(rows) => rows,
        Err(err) => {
            eprintln!("{err}");
            return HttpResponse::NotFound().body(err.to_string());
        }
    };

    if rows.is_empty() {
        return HttpResponse::NotFound().body("No challenges found");
    }
    let mut challenges = Vec::new();
    for row in rows {
        let markers = match sqlx::query_as!(
            Marker,
            r#"SELECT m.id, m.latitude, m.longitude FROM markers as m
            INNER JOIN challenge_markers as c_m
            ON m.id = c_m.marker_id
            WHERE c_m.challenge_id = ?"#, row.id)
            .fetch_all(pool).await {
            Ok(markers) => markers,
            Err(err) => {
                eprintln!("{err}");
                return HttpResponse::InternalServerError().body("Database error");
            }
        };

        let vertices: Vec<(f64, f64)> = match serde_json::from_value(row.vertices.unwrap()) {
            Ok(val) => val,
            Err(err) => {
                eprintln!("{err}");
                return HttpResponse::InternalServerError().body("Err");
            }
        };

        challenges.push(Challenge {
            id: row.id,
            title: row.title,
            description: row.description,
            markers,
            polygon: Polygon {
                id: row.polygon_id,
                vertices,
            },
        });
    }
    match serde_json::to_string(&challenges) {
        Ok(result) => HttpResponse::Ok().body(result),
        Err(err) => {
            eprintln!("{err}");
            return HttpResponse::InternalServerError().body(""); //TODO: json error? idk
        }
    }
}

#[post("api/challenges")]
pub async fn put_challenges(challenges: web::Json<Vec<Challenge>>, pool: web::Data<MySqlPool>) -> impl Responder {
    for challenge in challenges.0 {
        println!("{}", challenge.title);
    }
    HttpResponse::Ok().body("kk")
}

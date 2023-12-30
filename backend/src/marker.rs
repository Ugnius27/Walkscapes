use actix_web::{get, HttpResponse, Responder, web};
use serde::Serialize;
use sqlx::{FromRow, MySqlPool};

#[derive(Debug, FromRow, Serialize)]
pub struct Marker {
    pub id: i32,
    pub latitude: f64,
    pub longitude: f64,
}

impl Marker {
    pub fn new() -> Self {
        Marker {
            id: 0,
            latitude: 0.0,
            longitude: 0.0,
        }
    }
}

#[get("api/record/markers")]
pub async fn get_markers(pool: web::Data<MySqlPool>) -> impl Responder {
    let rows = match sqlx::query!("SELECT id, latitude, longitude FROM markers INNER JOIN records on records.marker_fk = id").fetch_all(pool.get_ref()).await {
        Ok(rows) => rows,
        Err(err) => {
            eprintln!("{err}");
            return HttpResponse::NotFound().body("No markers found");
        }
    };
    let mut markers = Vec::new();
    for row in rows {
        let marker = Marker {
            id: row.id,
            latitude: row.latitude,
            longitude: row.longitude,
        };
        markers.push(marker);
    }
    match serde_json::to_string(&markers) {
        Ok(result) => HttpResponse::Ok().body(result),
        Err(err) => {
            eprintln!("{err}");
            return HttpResponse::InternalServerError().body(""); //TODO: json error? idk
        }
    }
}


pub async fn insert_marker(pool: &sqlx::MySqlPool, marker: Marker) -> Result<i32, sqlx::Error> {
    let result = sqlx::query!(
        "INSERT INTO markers (latitude, longitude) VALUES (?, ?)",
        marker.latitude,
        marker.longitude
    )
        .execute(pool)
        .await?;
    Ok(result.last_insert_id() as i32)
}

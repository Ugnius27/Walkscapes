use actix_web::{delete, get, HttpResponse, post, Responder, web};
use actix_web::web::Data;
use maud::{html, Markup};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, MySqlPool};
use sqlx::error::DatabaseError;
use sqlx::types::Json;
use crate::user_error::UserError;

#[derive(Debug, FromRow, Serialize, Deserialize, Clone, Default)]
pub struct Polygon {
    #[serde(default)]
    pub id: Option<i32>,
    #[serde(default)]
    pub vertices: Option<Vec<(f64, f64)>>,
}

// impl Polygon {
//     pub fn new() -> Self {
//         Polygon {
//             ..Default::default()
//         }
//     }
// }

#[get("api/polygons")]
pub async fn get_polygons(pool: web::Data<MySqlPool>) -> impl Responder {
    let pool = pool.get_ref();
    let polygons = match get_polygons_from_db(&pool).await {
        Ok(val) => val,
        Err(err) => {
            eprintln!("{err}");
            return HttpResponse::InternalServerError().body(format!("{err}"));
        }
    };

    HttpResponse::Ok().json(polygons)
}

#[get("api/polygons/{id}")]
pub async fn get_polygon(id: web::Path<i32>, pool: web::Data<MySqlPool>) -> impl Responder {
    let id = id.into_inner();
    let polygon = match get_polygon_from_db(id, pool.get_ref()).await {
        Ok(val) => val,
        Err(err) => {
            eprintln!("{err}");
            return HttpResponse::InternalServerError().body(format!("{err}"));
        }
    };

    HttpResponse::Ok().body(polygon_to_html(&polygon).into_string())
}

#[delete("api/polygons/{id}")]
async fn delete_polygon(id: web::Path<i32>, pool: web::Data<MySqlPool>) -> impl Responder {
    let pool = pool.get_ref();
    if let Err(err) = delete_polygon_from_db(id.into_inner(), pool).await {
        return match err {
            UserError::NotFound(_) => HttpResponse::NotFound().body(format!("{err}")),
            _ => HttpResponse::InternalServerError().body(format!("{err}")),
        };
    }

    HttpResponse::Ok().body("")
}

#[post("api/polygons")]
async fn post_polygon(polygon: web::Json<Polygon>, pool: web::Data<MySqlPool>) -> Result<impl Responder, UserError> {
    let polygon_id = add_polygon_to_db(polygon.0, pool.get_ref()).await?;
    Ok(web::Json(polygon_id))
}

async fn delete_polygon_from_db(id: i32, pool: &MySqlPool) -> Result<(), UserError> {
    let result = sqlx::query!(r#"
    DELETE FROM polygons
    WHERE id = ?"#,
        id).execute(pool).await?;

    if result.rows_affected() < 1 {
        return Err(UserError::NotFound(id));
    }
    Ok(())
}

async fn get_polygon_from_db(id: i32, pool: &MySqlPool) -> Result<Polygon, UserError> {
    let row = sqlx::query!(r#"
    SELECT
    id,
    JSON_EXTRACT(ST_AsGeoJSON(vertices), '$.coordinates[0]') AS vertices
    FROM polygons
    WHERE id = ?"#,
        id).fetch_one(pool).await?;

    let vertices = row.vertices.ok_or_else(|| "Error parsing polygon vertices from database")?;
    let vertices: Vec<(f64, f64)> = serde_json::from_value(vertices)?; //todo refactor into function
    Ok(Polygon {
        id: Some(row.id),
        vertices: Some(vertices),
    })
}

async fn get_polygons_from_db(pool: &MySqlPool) -> Result<Vec<Polygon>, Box<dyn std::error::Error>> {
    let rows = sqlx::query!(r#"
    SELECT
    id,
    JSON_EXTRACT(ST_AsGeoJSON(vertices), '$.coordinates[0]') AS vertices
    FROM polygons"#).fetch_all(pool).await?;

    let mut polygons = Vec::new();
    for row in rows {
        let vertices = row.vertices.ok_or_else(|| String::from("Error parsing polygon vertices from database"))?;
        let vertices: Vec<(f64, f64)> = serde_json::from_value(vertices)?; //todo refactor into function

        polygons.push(Polygon {
            id: Some(row.id),
            vertices: Some(vertices),
        })
    }

    Ok(polygons)
}

async fn add_polygon_to_db(polygon: Polygon, pool: &MySqlPool) -> Result<i32, UserError> {
    let polygon_string = polygon_to_db_string(&polygon).map_err(|_| UserError::Internal)?;

    let result = sqlx::query!(r#"
    INSERT INTO polygons (vertices)
    VALUES (ST_GeomFromText(?))"#,
    polygon_string).execute(pool).await?;

    Ok(result.last_insert_id() as i32)
}

fn polygon_to_db_string(polygon: &Polygon) -> Result<String, Box<dyn std::error::Error>> {
    let mut polygon_string;
    if let Some(vertices) = &polygon.vertices {
        if vertices.len() < 3 {
            return Err("Not enough vertices in polygon".into());
        }

        polygon_string = String::from("POLYGON((");
        for vertex in vertices {
            polygon_string.push_str(&format!("{} {},", vertex.0, vertex.1));
        }
        polygon_string.push_str(&format!("{} {}))", vertices[0].0, vertices[0].1));
    } else {
        return Err("No vertices in polygon".into());
    }
    Ok(polygon_string)
}

fn polygon_to_html(polygon: &Polygon) -> Markup {
    html! {
        script {"attach_listener_to_element('polygon_modal_delete', deleteFocusedPolygon)"}
        p {(polygon.id.unwrap())}
        button
            id={"polygon_modal_delete"}
            hx-delete={"../api/polygons/" (polygon.id.unwrap())}
            hx-confirm={"Delete?"}
            {"Delete"}
        button
            disabled
            {"Edit"}
    }
}
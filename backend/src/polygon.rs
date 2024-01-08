use actix_web::{get, HttpResponse, post, Responder, web};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, MySqlPool};

#[derive(Debug, FromRow, Serialize, Deserialize, Clone)]
pub struct Polygon {
    #[serde(default)]
    pub id: Option<i32>,
    #[serde(default)]
    pub vertices: Option<Vec<(f64, f64)>>,
}

// impl Polygon {
//     pub fn new() -> Self {
//         Polygon {
//             id: None,
//             vertices: None,
//         }
//     }
// }

#[get("api/polygons")]
async fn get_polygons(pool: web::Data<MySqlPool>) -> impl Responder {
    let pool = pool.get_ref();
    let polygons = match read_polygons(&pool).await {
        Ok(val) => val,
        Err(err) => {
            eprintln!("{err}");
            return HttpResponse::InternalServerError().body(format!("{err}"));
        }
    };

    HttpResponse::Ok().json(polygons)
}

#[post("api/polygons")]
async fn post_polygon(polygon: web::Json<Polygon>, pool: web::Data<MySqlPool>) -> impl Responder {
    let polygon_id = match create_polygon(polygon.0, pool.get_ref()).await {
        Ok(val) => val,
        Err(err) => {
            eprintln!("{err}");
            return HttpResponse::InternalServerError().body(format!("{err}"));
        }
    };
    HttpResponse::Ok().json(polygon_id)
}

async fn read_polygons(pool: &MySqlPool) -> Result<Vec<Polygon>, Box<dyn std::error::Error>> {
    let rows = sqlx::query!(r#"
    SELECT
    id,
    JSON_EXTRACT(ST_AsGeoJSON(vertices), '$.coordinates[0]') AS vertices
    FROM polygons"#).fetch_all(pool).await?;

    let mut polygons = Vec::new();
    for row in rows {
        let vertices = row.vertices.ok_or_else(|| String::from("Error parsing polygon vertices from database"))?;
        let vertices: Vec<(f64, f64)> = serde_json::from_value(vertices)?; //todo! refactor into function

        polygons.push(Polygon {
            id: Some(row.id),
            vertices: Some(vertices),
        })
    }

    Ok(polygons)
}

async fn create_polygon(polygon: Polygon, pool: &MySqlPool) -> Result<i32, Box<dyn std::error::Error>> {
    let polygon_string = polygon_to_db_string(&polygon)?;

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
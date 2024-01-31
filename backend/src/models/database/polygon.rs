use sqlx::{MySqlPool, Error};
use crate::models::Polygon;
use crate::routes::user_error::UserError;

//todo REWRITE ALL THIS SHIT

pub async fn delete_polygon_from_db(id: i32, pool: &MySqlPool) -> Result<(), Error> {
    let result = sqlx::query!(
        r#"DELETE FROM polygons
        WHERE id = ?"#,
        id
    ).execute(pool).await?;
    Ok(())
}

//todo
pub async fn get_polygon_from_db(id: i32, pool: &MySqlPool) -> Result<Polygon, Box<dyn std::error::Error>> {
    let row = sqlx::query!(
        r#"SELECT
        id,
        JSON_EXTRACT(ST_AsGeoJSON(vertices), '$.coordinates[0]') AS vertices
        FROM polygons
        WHERE id = ?"#,
        id
    ).fetch_one(pool).await?;

    let vertices = row.vertices.ok_or_else(|| "Error parsing polygon vertices from database")?;
    let vertices: Vec<(f64, f64)> = serde_json::from_value(vertices)?; //todo refactor into function

    Ok(Polygon {
        id: row.id,
        vertices,
    })
}

//todo
pub async fn get_polygons_from_db(pool: &MySqlPool) -> Result<Vec<Polygon>, Box<dyn std::error::Error>> {
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
            id: row.id,
            vertices,
        })
    }

    Ok(polygons)
}

pub async fn add_polygon_to_db(polygon: Polygon, pool: &MySqlPool) -> Result<i32, UserError> {
    let polygon_string = polygon_to_db_string(&polygon).map_err(|_| UserError::Internal)?;

    let result = sqlx::query!(r#"
    INSERT INTO polygons (vertices)
    VALUES (ST_GeomFromText(?))"#,
    polygon_string).execute(pool).await?;

    Ok(result.last_insert_id() as i32)
}

//todo
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

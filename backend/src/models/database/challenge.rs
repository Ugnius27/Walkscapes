use sqlx::MySqlPool;
use crate::models::Challenge;
use crate::polygon::Polygon;
use crate::marker::Marker;

pub async fn get_challenges_from_db(pool: &MySqlPool) -> Result<Vec<Challenge>, Box<dyn std::error::Error>> {
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
            is_active: row.is_active != 0, //byte to bool conversion
        });
    }
    Ok(challenges)
}

pub async fn get_challenge_from_db(challenge_id: i32, pool: &MySqlPool) -> Result<Challenge, Box<dyn std::error::Error>> {
    let row = sqlx::query!(r#"
    SELECT * FROM challenges
    WHERE id = ?"#, challenge_id).fetch_one(pool).await?;
    let challenge = Challenge {
        id: Some(row.id),
        title: row.title,
        description: row.description,
        polygon: Polygon {
            id: Some(row.polygon_id),
            vertices: None, //todo maybe fix someday
        },
        is_active: row.is_active != 0, //byte to bool conversion
        markers: Vec::new(),
    };
    Ok(challenge)
}

pub async fn add_challenge_to_db(challenge: Challenge, pool: &MySqlPool) -> Result<i32, Box<dyn std::error::Error>> {
    let result = sqlx::query!(r#"
        INSERT INTO
        challenges (title, description, polygon_id, is_active)
        values (?, ?, ?, ?);"#,
        challenge.title,
        challenge.description,
        challenge.polygon.id,
        challenge.is_active
    ).execute(pool).await?;
    Ok(result.last_insert_id() as i32)
}

pub async fn delete_challenge_from_db(challenge_id: i32, pool: &MySqlPool) -> Result<(), Box<dyn std::error::Error>> {
    sqlx::query!(r#"
        DELETE FROM challenges
        WHERE id = ?"#, challenge_id).execute(pool).await?;
    Ok(())
}

pub async fn edit_challenge_in_db(challenge: Challenge, pool: &MySqlPool) -> Result<(), Box<dyn std::error::Error>> {
    sqlx::query!(r#"
        UPDATE challenges
        SET
        title = ?,
        description = ?,
        polygon_id = ?,
        is_active =?
        WHERE id = ?"#,
        challenge.title,
        challenge.description,
        challenge.polygon.id,
        challenge.is_active,
        challenge.id).execute(pool).await?;
    Ok(())
}

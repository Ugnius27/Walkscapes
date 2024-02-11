use sqlx::{Error, MySqlPool};
use crate::models::Challenge;

pub async fn get_challenges(pool: &MySqlPool) -> Result<Vec<Challenge>, Error> {
    Ok(sqlx::query_as!(
        Challenge,
        r#"SELECT
        id,
        title,
        description,
        polygon_id,
        is_active as 'is_active: bool',
        is_visible as 'is_visible: bool'
        FROM challenges"#,
        ).fetch_all(pool).await?)
}

pub async fn get_challenge_by_id(challenge_id: i32, pool: &MySqlPool) -> Result<Challenge, Error> {
    Ok(sqlx::query_as!(
        Challenge,
        r#"SELECT
        id,
        title,
        description,
        polygon_id,
        is_active as 'is_active: bool',
        is_visible as 'is_visible: bool'
        FROM challenges
        WHERE id = ?"#,
        challenge_id
    ).fetch_one(pool).await?)
}

pub async fn insert_challenge(challenge: &Challenge, pool: &MySqlPool) -> Result<i32, Error> {
    let result = sqlx::query!(
        r#"INSERT INTO challenges
        (title,
        description,
        polygon_id,
        is_active,
        is_visible)
        values (?, ?, ?, ?, ?);"#,
        challenge.title,
        challenge.description,
        challenge.polygon_id,
        challenge.is_active,
        challenge.is_visible
    ).execute(pool).await?;
    Ok(result.last_insert_id() as i32)
}

pub async fn delete_challenge_by_id(challenge_id: i32, pool: &MySqlPool) -> Result<(), Error> {
    sqlx::query!(
        r#"DELETE FROM challenges
        WHERE id = ?"#,
        challenge_id).execute(pool).await?;
    Ok(())
}

pub async fn update_challenge(challenge: &Challenge, pool: &MySqlPool) -> Result<(), Error> {
    sqlx::query!(
        r#"UPDATE challenges
        SET
        title = ?,
        description = ?,
        polygon_id = ?,
        is_active = ?,
        is_visible = ?
        WHERE id = ?"#,
        challenge.title,
        challenge.description,
        challenge.polygon_id,
        challenge.is_active,
        challenge.is_visible,
        challenge.id
    ).execute(pool).await?;
    Ok(())
}

use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use crate::models::Marker;
use crate::models::polygon::Polygon;

#[derive(Serialize)]
pub struct Challenge {
    pub id: i32,
    pub title: String,
    pub description: String,
    pub polygon_id: i32,
    pub is_active: bool,
    pub is_visible: bool,
}

impl From<ChallengePostForm> for Challenge {
    fn from(value: ChallengePostForm) -> Self {
        Challenge {
            id: 0,
            title: value.title,
            description: value.description,
            polygon_id: value.polygon_id,
            is_active: if value.is_active.is_some() { true } else { false },
            is_visible: if value.is_visible.is_some() { true } else { false },
        }
    }
}

#[derive(Deserialize)]
pub struct ChallengePostForm {
    title: String,
    description: String,
    polygon_id: i32,
    is_active: Option<String>,
    is_visible: Option<String>,
}
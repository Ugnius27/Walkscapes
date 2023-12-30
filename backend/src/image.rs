use actix_web::{get, HttpResponse, Responder, web};
use serde::Serialize;
use sqlx::{FromRow, MySqlPool};


#[derive(Debug, FromRow, Serialize)]
pub struct Image {
    pub id: i32,
    pub filename: String,
    pub image_data: Vec<u8>,
}

#[derive(Debug, FromRow, Serialize)]
struct RecordImage {
    record_fk: i32,
    id: i32,
    filename: String,
    image_data: Vec<u8>,
}

impl From<Image> for RecordImage {
    fn from(image: Image) -> RecordImage {
        RecordImage {
            record_fk: 0,
            id: image.id,
            filename: image.filename,
            image_data: image.image_data,
        }
    }
}

//TODO: sanitize inputs
#[get("api/record/marker={marker_id}/photo={photo_id}")]
pub async fn get_record_image(pool: web::Data<MySqlPool>, path: web::Path<(i32, i32)>) -> impl Responder {
    let (record_id, photo_id) = path.into_inner();
    match sqlx::query_as!(RecordImage, "SELECT record_fk, id, filename, image_data FROM images WHERE record_fk = ? AND id = ?", record_id, photo_id)
        .fetch_one(pool.get_ref()).await {
        Ok(image) =>
            HttpResponse::Ok()
                .content_type("image")
                .body(image.image_data),
        Err(_) => HttpResponse::NotFound().body("Image not found"),
    }
}

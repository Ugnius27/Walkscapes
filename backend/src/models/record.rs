use actix_multipart::form::MultipartForm;
use actix_multipart::form::tempfile::TempFile;
use actix_multipart::form::text::Text;
use serde::Serialize;
use sqlx::FromRow;

#[derive(Serialize)]
pub struct Record {
    pub id: i32,
    pub marker_id: i32,
    pub description: String,
}

impl Record {
    fn new() -> Self {
        Record {
            id: 0,
            marker_id: 0,
            description: String::new(),
        }
    }
}

#[derive(MultipartForm)]
pub struct RecordUploadForm {
    pub description: Text<String>,
    pub files: Vec<TempFile>,
}
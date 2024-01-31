use actix_multipart::Field;
use std::str::FromStr;
use futures_util::StreamExt;
use crate::models::Image;

pub async fn extract_bytes_from_field(mut field: Field) -> Result<Vec::<u8>, &'static str> {
    let mut bytes = Vec::new();
    while let Some(chunk) = field.next().await {
        bytes.extend_from_slice(&chunk.map_err(|_| "Problem processing payload")?);
    }
    Ok(bytes)
}

pub async fn extract_image_from_field(field: Field) -> Result<Image, &'static str> {
    let filename = field.content_disposition()
        .get_filename()
        .ok_or("Malformed field in multipart")? //Not sure if this check is necessary
        .to_owned();
    let bytes = extract_bytes_from_field(field).await?;
    Ok(Image {
        id: 0,
        filename,
        image_data: bytes,
    })
}

pub async fn extract_string_from_field(field: Field) -> Result<String, &'static str> {
    let bytes = extract_bytes_from_field(field).await?;
    Ok(String::from_utf8(bytes).map_err(|_| "String in multipart was not UTF8")?)
}

pub async fn extract_f64_from_field(field: Field) -> Result<f64, &'static str> {
    let bytes = extract_bytes_from_field(field).await?;
    unsafe {
        match f64::from_str(&String::from_utf8_unchecked(bytes)) {
            Ok(f) => Ok(f),
            Err(_) => Err("Failed to parse float in multipart"),
        }
    }
}



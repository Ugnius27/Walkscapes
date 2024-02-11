use std::error::Error;
use std::fmt;
use actix_web::http::StatusCode;
use actix_web::ResponseError;

pub type UserResult<T> = Result<T, UserError>;

#[derive(Debug)]
pub enum UserError {
    NotFound(i32),
    Dependency(String),
    Parse(String),
    Internal,
    NotImplemented(String),
}

impl Error for UserError {}

impl ResponseError for UserError {
    fn status_code(&self) -> StatusCode {
        match *self {
            UserError::Internal => StatusCode::INTERNAL_SERVER_ERROR,
            UserError::Dependency(_) => StatusCode::UNPROCESSABLE_ENTITY,
            UserError::NotFound(_) => StatusCode::NOT_FOUND,
            UserError::Parse(_) => StatusCode::BAD_REQUEST,
            UserError::NotImplemented(_) => StatusCode::NOT_IMPLEMENTED,
        }
    }
}

impl fmt::Display for UserError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        type E = UserError;
        match self {
            E::NotFound(id) => write!(f, "No item with ID {id} found"),
            E::Dependency(message) => write!(f, "{}", message),
            E::Internal => write!(f, "An internal server error occurred :("),
            E::Parse(message) => write!(f, "{}", message),
            E::NotImplemented(message) => write!(f, "{}", message),
        }
    }
}

impl From<sqlx::Error> for UserError {
    fn from(err: sqlx::Error) -> Self {
        match err {
            sqlx::Error::RowNotFound => UserError::NotFound(0),
            _ => UserError::Internal,
        }
    }
}

impl From<serde_json::Error> for UserError {
    fn from(value: serde_json::Error) -> Self {
        UserError::Parse(value.to_string())
    }
}

impl From<&str> for UserError {
    fn from(value: &str) -> Self {
        UserError::Internal
    }
}
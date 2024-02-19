use serde::Deserialize;

#[derive(Deserialize)]
pub struct LoginForm {
    pub password: String,
}
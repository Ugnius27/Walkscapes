use actix_web::{get, HttpResponse, post, Responder, web};
use maud::Markup;
use crate::routes::user_error::UserResult;
use crate::markup::admin::*;
use crate::models::login::LoginForm;

#[get("admin/")]
pub async fn get_login_form() -> UserResult<Markup> {
    Ok(form_index(""))
}

#[post("admin/")]
pub async fn post_login_form(web::Form(login_form): web::Form<LoginForm>, password: web::Data<String>) -> UserResult<impl Responder> {
    if login_form.password == *password.into_inner() {
        Ok(panel_index())
    } else {
        Ok(form_index("Password incorrect. Try again"))
    }
}

#[get("admin")]
pub async fn admin_redirect() -> UserResult<impl Responder> {
    Ok(HttpResponse::Found().append_header(("location", "admin/")).finish())
}

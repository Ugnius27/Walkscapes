use maud::{html, Markup};
use crate::models::challenge::

pub fn challenges_index_html(challenges: &Vec<Challenge>) -> Markup {
    html! {
        ul id="challenges_list" {
            (new_challenge_tile())
            @for challenge in challenges {
                (challenge_tile_html(&challenge))
            }
        }
    }
}

pub fn read_challenge_html(challenges: &Vec<Challenge>, id: i32) -> Markup {
    html! {
        ul id="challenges_list" {
            (new_challenge_tile())

            @for challenge in challenges {
                @if challenge.id.unwrap() == id {
                    (view_form(challenge))
                } @else {
                    (challenge_tile_html(challenge))
                }
            }
        }
    }
}

fn new_challenge_tile() -> Markup {
    html! {
       li.button.hoverable hx-get="new_challenge.html" hx-target="#challenges_list" {("CREATE NEW CHALLENGE")}
   }
}

pub fn challenge_tile_html(challenge: &Challenge) -> Markup {
    html! {
        li.button.hoverable
            hx-get={"../api/challenges/" (challenge.id.unwrap())}
            hx-target="#challenges_list"
            hx-swap="outerHTML"
            {(challenge.title)}
    }
}

fn view_form(challenge: &Challenge) -> Markup {
    html! {
        script {
            "setViewOnPoly("(challenge.polygon.id.unwrap())")"
        }
        li.button.selectable id="this_challenge" {
            div {
                div {
                    label { "Title:" }
                    p {(challenge.title)}
                }
                div {
                    label { "Description:" }
                    p {(challenge.description)}
                }
                div {
                    label { "Polygon:" }
                    p {(challenge.polygon.id.unwrap())}
                }
                div {
                    label { "Active:" }
                    input type="checkbox" disabled checked[challenge.is_active] {}
                }

                button
                    hx-get={"../api/challenges/" (challenge.id.unwrap()) "/edit" }
                    hx-target="#this_challenge"
                    hx-swap="outerHTML"
                    {"Edit"}
                button
                    hx-delete={"../api/challenges/" (challenge.id.unwrap()) }
                    hx-target="#this_challenge"
                    hx-swap="outerHTML"
                    hx-confirm={"Are you sure you want to delete \"" (challenge.title) "\""}
                    {"Delete"}
                button
                    hx-get="../api/challenges" hx-target="#challenges_list" style="float: right;"
                    hx-swap="outerHTML"
                    {"Close"}
                }
        }
    }
}

pub fn edit_form_html(challenge: &Challenge) -> Markup {
    html! {
        li.button.selectable id="this_challenge" {
            form
                id="challenge_edit_form"
                hx-put={"../api/challenges/" (challenge.id.unwrap()) }
                hx-target="#this_challenge"
                hx-swap="outerHTML"
            {
                div {
                    label { "Title:" }
                    input name="title" required value=(challenge.title) {}
                }
                div {
                    label { "Description:" }
                    textarea name="description" required {(challenge.description)}
                }
                div {
                    label { "Polygon:" }
                    input.readonly id="polygonId" name="polygon_id" required readonly value=(challenge.polygon.id.unwrap()) {}
                }
                div {
                    label { "Active:" }
                    input name="is_active" type="checkbox" checked[challenge.is_active] {}
                }

                button
                    id="submit_button"
                    {"Save"}
                button
                    type="button"
                    hx-get={"../api/challenges/" (challenge.id.unwrap()) }
                    hx-target="#challenges_list"
                    hx-swap="outerHTML"
                    onclick="disable_form_open()"
                    {"Cancel"}
            }
        }
        script {
            "enable_form_open();
            attach_listener_to_element('challenge_edit_form', disable_form_open);
            setViewOnPoly("(challenge.polygon.id.unwrap())")";
        }
   }
}

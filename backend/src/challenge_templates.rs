use maud::{html, Markup};
use crate::challenge::Challenge;

pub fn challenges_index_html(challenges: &Vec<Challenge>) -> Markup {
    html! {
        ul id="challenges" {
            (new_challenge_tile())
            @for challenge in challenges {
                (challenge_tile(&challenge))
            }
        }
    }
}

pub fn read_challenge_html(challenges: &Vec<Challenge>, id: i32) -> Markup {
    html! {
        ul id="challenges" {
            (new_challenge_tile())

            @for challenge in challenges {
                @if challenge.id.unwrap() == id {
                    (view_form(challenge))
                } @else {
                    (challenge_tile(challenge))
                }
            }
        }
    }
}

fn new_challenge_tile() -> Markup {
    html! {
       li.button hx-get=("new_challenge.html") hx-swap=("outerHTML") {("CREATE NEW CHALLENGE")}
   }
}

fn challenge_tile(challenge: &Challenge) -> Markup {
    html! {
        li.button
            hx-get={"../api/challenges/" (challenge.id.unwrap())}
            hx-target="#challenges"
            {(challenge.title)}
    }
}

fn view_form(challenge: &Challenge) -> Markup {
    html! {
        li.button id="this_challenge" {
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

                div id="result" {}

                button disabled {"Edit"}
                button
                    hx-delete={"../api/challenges/" (challenge.id.unwrap()) }
                    hx-target="#this_challenge"
                    hx-swap="outerHTML"
                    hx-confirm={"Are you sure you want to delete \"" (challenge.title) "\""}
                    {"Delete"}
                button
                    hx-get="../api/challenges" hx-target="#challenges" style="float: right;"
                    {"Close"}
                }
        }
    }
}

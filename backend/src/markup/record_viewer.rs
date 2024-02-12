use maud::{html, Markup};
use crate::models::Record;
use crate::utils::truncate_string;

pub enum NavBehaviour {
    Close,
    ToEndpoint(String),
}

pub fn records_index(records: &[Record]) -> Markup {
    html! {
        div.sticky_menu {
            button style="float:right" onclick="close_record_viewer()" {"Close"}
            span style="float:left" {"Records at this location:"}
            div style="clear:both" {}
        }
        ul #records-list {
            @for record in records {
                (record_tile(record))
            }
        }
    }
}

pub fn record_index(record: &Record, record_image_ids: &[i32], navigation_behaviour: NavBehaviour) -> Markup {
    type NB = NavBehaviour;
    html! {
        script {"attach_listener_to_element('record_viewer_delete', ())"}
        div.sticky_menu {
            @match navigation_behaviour {
                NB::Close => {
                    button style="float:right" onclick={"close_record_viewer()"} {"Close"}
                }
                NB::ToEndpoint(endpoint) => {
                    button style="float:right" hx-get=(endpoint) hx-target="#record-viewer" {"Close"}
                }
            }
            button
                style="float:left"
                id="record_viewer_delete"
                hx-delete={"record-viewer/records/"(record.id)}
                hx-target="#record-viewer"
                hx-confirm="Delete?"
                {"Delete"}
            div style="clear:both" {}
        }

        p {"ID: "(record.id)}
        p {"Description:"}
        p {(record.description)}

        @for image_id in record_image_ids {
            hr;
            img.record src={"../api/images/"(image_id)} {}
        }
    }
}

fn record_tile(record: &Record) -> Markup {
    html! {
        li.button.hoverable
            hx-get={"record-viewer/records/"(record.id)}
            hx-target="#record-viewer"
        {
            span style="float:left" {"ID: "(record.id)}
            span style="float:right" {(truncate_string(&record.description, 20))}
            div style="clear:both" {}
        }
    }
}

//todo BROKEN
pub fn no_records(marker_id: i32) -> Markup {
    html! {
        script {"attach_listener_to_element('record_viewer_delete', ())"}
        div.sticky_menu {
            button
                style="float:right"
                onclick="close_record_viewer()"
                {"Close"}
            button
                style="float:left"
                id="record_viewer_delete"
                hx-delete={"record-viewer/markers/"(marker_id)}
                hx-confirm="Delete?"
                {"Delete"}
            div
                style="clear:both" {}
        }
        p {"No records at this location"}
    }
}
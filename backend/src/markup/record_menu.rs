use maud::{html, Markup};
use crate::models::Record;

pub fn record_view_html(record: &Record) -> Markup {
    html! {
        div.sticky_menu {
            button style="float:right" onclick="close_record()" {"Close"}
            button style="float:left" disabled {"Delete"}
        }
        p {"Description:"}
        p {(record.description)}
        // @for image_id in record.photos.iter() {
        //     hr;
        //     img.record src={"../api/record/marker="(record.id)"/photo="(image_id)} {}
        // }
    }
}
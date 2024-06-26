use maud::{html, Markup};
use crate::models::Polygon;

pub fn polygon_to_html(polygon: &Polygon) -> Markup {
    html! {
        script {"attach_listener_to_element('polygon_modal_delete', deleteFocusedPolygon)"}
        p {"Polygon ID: "(polygon.id)}
        button
            id={"polygon_modal_delete"}
            hx-delete={"polygon-editor/" (polygon.id)}
            hx-confirm={"Delete?"}
            {"Delete"}
        // button
        //     disabled
        //     {"Edit"}
    }
}

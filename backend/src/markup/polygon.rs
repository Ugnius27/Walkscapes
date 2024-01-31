use maud::{html, Markup};
use crate::models::Polygon;

pub fn polygon_to_html(polygon: &Polygon) -> Markup {
    html! {
        script {"attach_listener_to_element('polygon_modal_delete', deleteFocusedPolygon)"}
        p {(polygon.id.unwrap())}
        button
            id={"polygon_modal_delete"}
            hx-delete={"../api/polygons/" (polygon.id.unwrap())}
            hx-confirm={"Delete?"}
            {"Delete"}
        button
            disabled
            {"Edit"}
    }
}

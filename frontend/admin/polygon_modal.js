function open_polygon_modal(polygon) {
    let modal = document.getElementById("polygon_modal");
    let polygon_id = polygons_to_ids[polygon._leaflet_id];
    htmx.ajax('GET', `${API_PATH}/polygons/${polygon_id}`, '#polygon_modal_content')
    modal.classList.add("show");
}

function close_polygon_modal() {
    let modal = document.getElementById("polygon_modal");
    modal.classList.remove("show");
    let modal_content = document.getElementById("polygon_modal_content");
    modal_content.innerHTML = "<p>...</p><button disabled>Delete</button><button disabled>Edit</button>";
}
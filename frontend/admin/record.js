let focused_marker = null;
let is_record_open = false;

function open_record_viewer(marker_id) {
    is_record_open = true;
    let menu = document.getElementById("record-viewer");
    htmx.ajax('GET', `record-viewer/markers/${marker_id}/records`, {target: '#record-viewer', swap: 'innerHTML'})
    menu.classList.add("show");
}

function close_record_viewer() {
    if (!is_record_open) {
        return;
    }
    is_record_open = false;
    let menu = document.getElementById("record-viewer");
    remove_marker_focus()
    menu.classList.remove("show");
    // let modal_content = document.getElementById("polygon_modal_content");
    // modal_content.innerHTML = "<p>...</p><button disabled>Delete</button><button disabled>Edit</button>";
}

function focus_marker(leaflet_marker, marker_id) {
    if (focused_marker != null) {
        remove_marker_focus();
    }
    focused_marker = leaflet_marker;
    focused_marker._icon.classList.add("red")
    open_record_viewer(marker_id);
}

function remove_marker_focus() {
    if (focused_marker == null) {
        return;
    }
    focused_marker._icon.classList.remove("red")
    focused_marker = null;
}


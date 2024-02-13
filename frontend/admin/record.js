let focused_marker = null;
let is_record_open = false;

function open_record_viewer(marker_id) {
    is_record_open = true;
    remove_focus()
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
    let modal_content = document.getElementById("polygon_modal_content");
    modal_content.innerHTML = "";
}

function focus_marker(leaflet_marker, marker_id) {
    if (focused_marker === leaflet_marker) {
        remove_marker_focus()
        close_record_viewer()
        return;
    }

    if (focused_marker != null) {
        remove_marker_focus()
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

function delete_marker(marker_database_id) {
    markers[marker_database_id].remove()
}


function htmx_delete_marker_if_empty(marker_id) {
    let source_id = "record_viewer_delete";
    let element = document.getElementById(source_id);
    element.addEventListener('htmx:afterRequest', function (event) {
        let source_element = event.detail.elt;
        if (source_element.id !== source_id) {
            return
        }
        if (!event.detail.successful) {
            return
        }
        //absolute hacky garbage
        let response;
        try {
            response = JSON.parse(event.detail.xhr.response);
        } catch {
            return
        }
        if (!"marker_id" in response) {
            return
        }
        close_record_viewer()
        delete_marker(response.marker_id)
        event.stopPropagation();
    })
}

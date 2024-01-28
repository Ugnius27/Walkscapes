function open_record(marker_id) {
    let menu = document.getElementById("record");
    // htmx.ajax('GET', `${API_PATH}/polygons/${polygon_id}`, '#polygon_modal_content')
    menu.classList.add("show");
}

function close_record() {
    let menu = document.getElementById("record");
    menu.classList.remove("show");
    // let modal_content = document.getElementById("polygon_modal_content");
    // modal_content.innerHTML = "<p>...</p><button disabled>Delete</button><button disabled>Edit</button>";
}

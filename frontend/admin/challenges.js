let challenges = null;

function updateForm() {
    let form = document.getElementById('form')

    let jsonData = focused.getLatLngs()[0].map((latlng) => {
        return [latlng.lat, latlng.lng];
    });
}

function enable_form_open() {
    form_open = true;
}

function disable_form_open() {
    form_open = false;
}

function set_polygon_id_in_form() {
    if (focused == null) {
        return;
    }
    let field = document.getElementById('polygonId');
    field.value = polygons[focused._leaflet_id];
}

function unset_polygon_id_in_form() {
    let field = document.getElementById('polygonId');
    field.value = "Please select a polygon";
}

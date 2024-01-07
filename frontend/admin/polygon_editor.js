let focused = null;
let form_open = false;
let polygons = {};
let markers = {};
let polygon_markers = {};

L.NewPolygonControl = L.EditControl.extend({

    options: {
        position: 'topleft',
        callback: map.editTools.startPolygon,
        kind: 'polygon',
        html: '▰'
    }

});

map.addControl(new L.NewPolygonControl());

function remove_focus() {
    if (focused == null) {
        return;
    }

    focused.setStyle({color: 'blue'});
    focused.disableEdit();
    focused = null;

    if (form_open) {
        unset_polygon_id_in_form();
    }
}

function focus(target) {
    focused = target;
    focused.setStyle({color: 'red'});
    target.enableEdit(map);
    if (form_open) {
        set_polygon_id_in_form()
    }
}

function on_polygon_click(event) {
    let poly = event.target;
    if (poly !== focused) {
        remove_focus();
        focus(poly);
        L.DomEvent.stopPropagation(event);
    }
}

map.on('click', function (event) {
    remove_focus();
    if (form_open) {
        unset_polygon_id_in_form()
    }
});


map.on('editable:vertex:new', function (event) {
    let editedLayer = event.layer;
    console.log(editedLayer._leaflet_id);

    // Access the coordinates of the edited polygon
    let editedPolygonCoordinates = editedLayer.getLatLngs();

    console.log('Edited Polygon Coordinates:', editedPolygonCoordinates);
});

map.on('editable:vertex:dragend', function (event) {
    let editedLayer = event.layer;
    console.log(editedLayer._leaflet_id);

    // Access the coordinates of the edited polygon
    let editedPolygonCoordinates = editedLayer.getLatLngs();
    console.log('Edited Polygon Coordinates:', editedPolygonCoordinates);
});

map.on('editable:vertex:clicked', function (event) {
    let editedLayer = event.layer;
    console.log(editedLayer._leaflet_id);

    // Access the coordinates of the edited polygon
    let editedPolygonCoordinates = editedLayer.getLatLngs();
    console.log('Edited Polygon Coordinates:', editedPolygonCoordinates);
});

map.on('editable:drawing:commit', function (event) {
    let poly = event.layer;
    if (!showPolygonPopup(poly)) {
        return;
    }
    console.log(poly._leaflet_id);
    focus(poly);
    poly.on('click', on_polygon_click);

    let polygonCoordinates = poly.getLatLngs()[0];
    console.log('Polygon Coordinates:', polygonCoordinates);
});

function polygon_to_json(polygon) {
    let vertices = polygon.getLatLngs()[0].map((latlng) => {
        return [latlng.lat, latlng.lng];
    });

    polygonJson = {
        id: -1,
        vertices: vertices
    }
    return JSON.stringify(polygonJson);
}

function showPolygonPopup(polygon) {
    let result = window.confirm("Do you want to save the polygon? Click Ok to save, Cancel to delete");

    if (!result) {
        map.removeLayer(polygon);
        return false;
    }

    fetch('../api/polygons', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: polygon_to_json(polygon)
    })
        .then(response => {
            polygons[polygon._leaflet_id] = response;
        })
        .catch(error => {
            console.error('Error making POST request:', error);
        });

    return true
}

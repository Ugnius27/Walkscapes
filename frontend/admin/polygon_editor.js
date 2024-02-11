let focused = null;
let form_open = false;
let polygons_layer = L.featureGroup().addTo(map);
let polygons_to_ids = {};
let ids_to_polygons = {};
let markers = {};

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

    focused.setStyle({color: '#3388ff'});
    focused = null;

    if (form_open) {
        unset_polygon_id_in_form();
    }

    //modal actions
    close_polygon_modal()
}

function focus(target) {
    focused = target;
    focused.setStyle({color: 'red'});
    // target.enableEdit(map);
    if (form_open) {
        set_polygon_id_in_form()
    }

    //modal actions
    open_polygon_modal(target);
}

function attach_enable_focus(polygon) {
    polygon.on('click', function (event) {
        let poly = event.target;
        if (poly !== focused) {
            remove_focus();
            focus(poly);
            L.DomEvent.stopPropagation(event);
        }
    });
}

map.on('click', function (event) {
    remove_focus();
    close_record();
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
    poly.disableEdit();


    // let polygonCoordinates = poly.getLatLngs()[0];
    // console.log('Polygon Coordinates:', polygonCoordinates);
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

async function post_polygon(polygon) {
    return await fetch('polygon-editor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: polygon_to_json(polygon)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON from the response
        })
        .catch(error => {
            console.error('Error making POST request:', error);
        });
}

async function showPolygonPopup(polygon) {
    let result = window.confirm("Do you want to save the polygon? Click Ok to save, Cancel to delete");

    if (!result) {
        map.removeLayer(polygon);
        return false;
    }
    attach_enable_focus(polygon)
    let polygon_id = await post_polygon(polygon);

    polygons_layer.addLayer(polygon)
    polygons_to_ids[polygon._leaflet_id] = polygon_id;
    ids_to_polygons[polygon_id] = polygon._leaflet_id;
    focus(polygon);
    return true
}

function deleteFocusedPolygon() {
    let db_id = polygons_to_ids[focused];
    polygons_to_ids[focused] = null;
    ids_to_polygons[db_id] = null;
    map.removeLayer(focused)
    remove_focus();
}

function polyByDbId(id) {
    let poly_id = ids_to_polygons[id]
    return polygons_layer.getLayer(poly_id);
}

function setViewOnPoly(id) {
    let poly = polyByDbId(id);
    remove_focus();
    focus(poly);
    map.fitBounds(poly.getBounds());
}

function focusPolyByDbId(id) {
    let poly = polyByDbId(id);
    remove_focus();
    focus(poly);
}

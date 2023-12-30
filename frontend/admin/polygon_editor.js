let focused = null;

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
    if (focused != null) {
        focused.setStyle({color: 'blue'});
        focused.disableEdit();
        focused = null;
    }
}

function focus(target) {
    focused = target;
    focused.setStyle({color: 'red'});
    target.enableEdit(map);
}

function on_polygon_click(event) {
    remove_focus();
    focus(event.target);

    L.DomEvent.stopPropagation(event);
}

map.on('click', function (event) {
    remove_focus();
});

map.on('editable:drawing:commit', function (event) {
    let poly = event.layer;
    console.log(poly._leaflet_id);
    focus(poly);
    poly.on('click', on_polygon_click);

    let polygonCoordinates = poly.getLatLngs()[0];
    console.log('Polygon Coordinates:', polygonCoordinates);
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

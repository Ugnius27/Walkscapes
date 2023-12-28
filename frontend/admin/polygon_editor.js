focused = null;

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
    var poly = event.layer;
    console.log(poly._leaflet_id);
    focus(poly);
    poly.on('click', on_polygon_click);

    var polygonCoordinates = poly.getLatLngs()[0];
    console.log('Polygon Coordinates:', polygonCoordinates);
});

map.on('editable:vertex:new', function (event) {
    var editedLayer = event.layer;
    console.log(editedLayer._leaflet_id);

    // Access the coordinates of the edited polygon
    var editedPolygonCoordinates = editedLayer.getLatLngs();
    console.log('Edited Polygon Coordinates:', editedPolygonCoordinates);
});

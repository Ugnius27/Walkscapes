const santaka = [54.89984180616253, 23.961551736420333];

var map = L.map('map').setView(santaka, 18);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, // Set the maximum zoom level
}).addTo(map);

var marker = L.marker(santaka).addTo(map);
marker.bindPopup("Kažkokia informacija")

var circle = L.circle(santaka, {
    color: 'red',
    fillColor: '#ffaa00',
    fillOpacity: 0.5,
    radius: 50
}).addTo(map);

map.on('click', function (e) {
    createMarker(map, e.latlng.lat, e.latlng.lng, e.latlng.toString())
})

function createMarker(map, lat, lng, text) {
    var marker = L.marker([lat, lng])
    marker.bindPopup(text).addTo(map)

    marker.on('dblclick', function () {
        marker.removeFrom(map)
    })
}

const MARKERS_API_ENDPOINT = '/api/record/markers';

var amountOfClusters = 0;
var radiusOfACluster = 0.0050;

const santaka = [54.89984180616253, 23.961551736420333];

var map = L.map('map').setView(santaka, 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
}).addTo(map);

var markerSantaka = L.marker(santaka).addTo(map);
markerSantaka.bindPopup("Santakos slėnis")

var coordsForUploading = [0, 0];
var records = [];
var markers = [];

var redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png'
});

var defaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

var markersForHtml = [];
var submitted = false;
let overlayClosedCallback = null;

putMarkersOnMap();
var addTableIsOnTheMap = false;
let customTableControl = createCustomTable();

console.log(window.location.pathname);
if (!window.location.pathname.includes('suggestions')) {
    addButtonOnMap(customTableControl);
}

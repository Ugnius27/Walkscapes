const API_BASE_URL = 'http://localhost:8080';
const MARKERS_API_ENDPOINT = '/api/record/markers';

var amountOfClusters = 0;
var radiusOfACluster = 0.00050;

const santaka = [54.89984180616253, 23.961551736420333];

var map = L.map('map').setView(santaka, 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20, // Set the maximum zoom level
}).addTo(map);

var markerSantaka = L.marker(santaka).addTo(map);
markerSantaka.bindPopup("Kažkokia informacija")


var records = [
    // {
    //     id: 1,
    //     latitude: 54.89984,
    //     longitude: 23.961321,
    //     description: "description of first record",
    // },
    // {
    //     id: 2,
    //     latitude: 54.899726,
    //     longitude: 23.961326,
    //     description: "description of second record",
    // },
    // {
    //     id: 3,
    //     latitude: 54.900393,
    //     longitude: 23.96175,
    //     description: "description of third record",
    // },
];

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
putMarkersOnMap();
var addTableIsOnTheMap = false;
let customTableControl = createCustomTable();
addButtonOnMap(customTableControl);
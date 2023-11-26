//import * as getDataFromDB from "./getDataFromDB.js";
//------------------ should be in another js file

const API_BASE_URL = 'http://localhost:8080';
const MARKERS_API_ENDPOINT = '/api/record/markers';

var amountOfClusters = 0;
var radiusOfACluster = 0.00050;

//-------------------

const santaka = [54.89984180616253, 23.961551736420333];

var map = L.map('map').setView(santaka, 18);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, // Set the maximum zoom level
}).addTo(map);

var markerSantaka = L.marker(santaka).addTo(map);
markerSantaka.bindPopup("Kažkokia informacija")

// var circle = L.circle(santaka, {
//     color: 'red',
//     fillColor: '#ffaa00',
//     fillOpacity: 0.5,
//     radius: 50
// }).addTo(map);

map.on('click', function (e) {
    createMarker(map, e.latlng.lat, e.latlng.lng, e.latlng.toString(), 0)
})


//------------ temporary variables ------------------

//const convertToArrayOfCoordinates = require('./additional.js');
//import { convertToArrayOfCoordinates } from './additional.js';

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

//coordinates = convertToArrayOfCoordinates(records);
coordinates = records.map(record => [record.latitude, record.longitude]);

var markers = [];

var redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png'
});

var defaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

//---------------------------------------------------
function toggleIcon(markers, markerNrToToggle, icon){
    // if (markers[markerNrToToggle].marker.getIcon() === icon){
    //     markers[markerNrToToggle].marker.setIcon(defaultIcon);
    //     return;
    // }

    markers[markerNrToToggle].marker.setIcon(icon);

    for (var i = 0; i < markers.length; i++){
        var mark = markers[i];

        //console.log(i + "   " + markerNrToToggle);
        if (i != markerNrToToggle){
            // console.log(" setting to   " + i);
            mark.marker.setIcon(defaultIcon)
        }
    }
    
    //markers[markerNr].isRed = !markers[markerNr].isRed;
}

var UUU = 777;
function createMarker(map, lat, lng, text, id) {
    console.log("markers lngth  " +  markers.length); 
    console.log([lat, lng]);
    var sameClusterMarkerNr = markerNrThatIsInTheSameCluster([lat, lng], radiusOfACluster);
    
    if (sameClusterMarkerNr != -1){  // new marker goes to existing cluster
        console.log("goes to existing cluster " + sameClusterMarkerNr + "   " + id);
        markers[sameClusterMarkerNr].ids[markers[sameClusterMarkerNr].ids.length] = id;
        markers[sameClusterMarkerNr].marker.openPopup();
        return;
    }
    console.log("does not go to existing cluster " + sameClusterMarkerNr);
    markers[markers.length] = 
    {
        ids: [id], // ids of all around markers 
        coordinates: [lat, lng],
        //amountOfRecords: 1,  // fdelete this one
        marker: null,
    }

    var markerNr = markers.length - 1;
    markers[markerNr].marker = L.marker([lat, lng]);
//console.log("create f: " + markerNr);
    // Creating a button with an id for reference
    // var buttonHtml = '<br><button id="popupButton' + markerNr + '">Click me!</button>';
    //var buttonHtml = '<br><button id="popupButton' + markerNr + '" onclick="togglePopup()">Click me!</button>';
    // var button1 = '<br><button id="popupButtonView' + markerNr + '" class="popup-button" onclick="redirectToSuggestionsPage()">View suggestions</button>';
    // var button2 = '<button id="popupButtonAdd' + markerNr + '" onclick="togglePopup()" class="popup-button">Add new description</button>';


    // markers[markerNr].marker.bindPopup('<div class="custom-popup-text">' + text + button1 + button2, { offset: [0, -20], className: 'custom-popup' }).addTo(map)
    var button1 = `<br><button id="popupButtonView${markerNr}" class="popup-button" onclick="redirectToSuggestionsPage(${markerNr})">View suggestions</button>`;
    var button2 = '<button id="popupButtonAdd' + markerNr + '" onclick="togglePopup()" class="popup-button">Add new description</button>';

    markers[markerNr].marker.bindPopup(`<div class="custom-popup-text">${text}${button1}${button2}`, { offset: [0, -20], className: 'custom-popup' }).addTo(map);

    toggleIcon(markers, markerNr, redIcon);

    markers[markerNr].marker.on('click', function () {
        //console.log("clicked on " + markerNr);
        toggleIcon(markers, markerNr, redIcon);
    })

    markers[markerNr].marker.on('dblclick', function () {
        markers[markerNr].marker.removeFrom(map)
    })

    // document.addEventListener('click', function (event) {
    //     //console.log("target id    "  + event.target.id);
    //     if (event.target.id === 'popupButtonAdd' + markerNr) {
    //         console.log("BUTTON WAS CLICKED " + markerNr);
    //     }
    // });

    // markers[markerNr].marker.on('popupopen', function () {
    //     console.log("openedd");
    //     //markers[markerNr].marker.setIcon(redIcon);
    //     toggleIcon(markers, markerNr, redIcon);
    // });

    markers[markerNr].marker.on('popupclose', function () {
        markers[markerNr].marker.setIcon(defaultIcon);
    });

    // Open popup when new marker is created
    markers[markerNr].marker.openPopup();
}

// function redirectToSuggestionsPage() {
//     // Assuming you have a suggestions page named 'suggestions.html'
//     window.location.href = 'suggestions.html';
// }
function redirectToSuggestionsPage(markerId) {
    // Construct the URL with the marker ID as a query parameter
    const url = `suggestions.html?markerId=${markerId}`;
    window.location.href = url;
}


// should be in another file --------------



// fetch markers from the API
async function fetchMarkers() {
    try {
      const response = await fetch(`${API_BASE_URL}${MARKERS_API_ENDPOINT}`);
      if (!response.ok) {
        throw new Error('Failed to fetch markers');
      }
  
      const markers = await response.json();

      console.log( markers);
      //console.log("markers length0: " + markers.length)
      return markers;

    } catch (error) {
      console.error(error);
      return [];
    }
}

async function fetchRecordsForMarker(markerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/record/marker=${markerId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch records for marker ${markerId}`);
      }
  
      const records = await response.json();
      //console.log("records0: " + records.length)
      //console.log(records);
      return records;
  
    } catch (error) {
      console.error(error);
      return [];
    }
}


async function fetchRecordImage(markerId, photoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/record/marker=${markerId}/photo=${photoId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch records for marker's ${markerId} photo ${photoId}`);
      }
  
      //const photo = await response;
      //console.log("records0: " + records.length)
      const photo = await response.blob(); // or await response.blob();
    
      // Log specific details instead of the entire response object
      //console.log("Photo length:", photo.length);



      /*const imageUrl = URL.createObjectURL(photo);
      const imgElement = document.createElement('img');
      imgElement.src = imageUrl;
      document.body.appendChild(imgElement);*/
      


      return photo;
  
    } catch (error) {
      console.error(error);
      return "";
    }
}

fetchRecordImage(23, 23);
  // Call the function
  //console.log("fetchjed records")
  //fetchRecordsForMarker(23);

  function extractMarkerData(marker) {
    return {
        ids: marker.ids,
        coordinates: marker.coordinates,
        // Add other properties you want to store
    };
    
}
var markersForHtml = [];
  
function putMarkersOnMap(){
    fetchMarkers().then(markersInJson => {
        //console.log(markersInJson.length);
        for (var i = 0; i < markersInJson.length; i++){
            //console.log(markersInJson[i].latitude + "   secs: " + (new Date()).getTime());
            createMarker(map, markersInJson[i].latitude, markersInJson[i].longitude, "hh", markersInJson[i].id);
        }

        //console.log("abbbbbbbbbb" + "   secs: " + (new Date()).getTime());
        //console.log(markers.length);
        markers[markers.length - 1].marker.closePopup();

        console.log(markers.length + "   jjjjjjjj");
        for (var i = 0; i < markers.length; i++){
            markersForHtml[i] = extractMarkerData(markers[i]);
        }
        

        localStorage.setItem('markers', JSON.stringify(markersForHtml));
    });    
}
putMarkersOnMap();

//-------------------------------------
function distance(point1, point2){
    //console.log("ddd: " + point1[0], "   " + point2[0] + "  " + point1[1] + "   " + point2[1]);
    console.log("distance: " + Math.sqrt(Math.pow((point1[0] - point2[0]), 2) + Math.pow((point1[1] - point2[1]), 2)));
    return Math.sqrt(Math.pow((point1[0] - point2[0]), 2) + Math.pow((point1[1] - point2[1]), 2));
}

// should be in suggestions.js

function markerNrThatIsInTheSameCluster(coordinates, radiusOfACluster){
    console.log(markers.length);
    for (var i = 0; i < markers.length; i++){

        if (distance(markers[i].coordinates, coordinates) <= radiusOfACluster){
            //console.log("!!!!");
            return i;
        }
    }

    return -1;
}

// console.log("last:");
// createMarker(map, 54.898726, 23.961326, "uu", 76);

// Add the Marker Cluster Group layer
// var markers2 = L.markerClusterGroup({maxClusterRadius: 50});

// // Add individual markers to the cluster group
// L.marker([54.900, 23.963326]).addTo(markers2).setIcon(redIcon);
// L.marker([54.900, 23.962826]).addTo(markers2).setIcon(redIcon);
// L.marker([54.9001, 23.962826]).addTo(markers2).setIcon(redIcon);

// L.marker([54.8991, 23.962826]).addTo(markers2).setIcon(redIcon);
// L.marker([54.8992, 23.962826]).addTo(markers2).setIcon(redIcon);
// L.marker([54.8993, 23.962826]).addTo(markers2).setIcon(redIcon);
// // Add more markers...

// // Add the Marker Cluster Group layer to the map
// map.addLayer(markers2);

// // Optionally, you can add additional layers, controls, etc.
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '© OpenStreetMap contributors'
// }).addTo(map);




// createMarker(map, 54.999726, 23.961326, "uu", 76);



// Save markers to localStorage
// console.log(markers.length + "   jjjjjjjj");
// localStorage.setItem('markers', JSON.stringify(markers));
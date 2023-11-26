//import * as getDataFromDB from "./getDataFromDB.js";
//------------------ should be in another js file

const API_BASE_URL = 'http://localhost:8080';
const MARKERS_API_ENDPOINT = '/api/record/markers';

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
    createMarker(map, e.latlng.lat, e.latlng.lng, e.latlng.toString())
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


function createMarker(map, lat, lng, text) {
    console.log("markers lngth  " +  markers.length); 
    markers[markers.length] = 
    {
        coordinates: [lat, lng],
        amountOfRecords: 1,  // fdelete this one
        marker: null,
    }

    var markerNr = markers.length - 1;
    markers[markerNr].marker = L.marker([lat, lng]);

    // Creating a button with an id for reference
    // var buttonHtml = '<br><button id="popupButton' + markerNr + '">Click me!</button>';
    //var buttonHtml = '<br><button id="popupButton' + markerNr + '" onclick="togglePopup()">Click me!</button>';
    var button1 = '<br><button id="popupButtonView' + markerNr + '" class="popup-button" onclick="redirectToSuggestionsPage()">View suggestions</button>';
    var button2 = '<button id="popupButtonAdd' + markerNr + '" onclick="togglePopup()" class="popup-button">Add new description</button>';


    markers[markerNr].marker.bindPopup('<div class="custom-popup-text">' + text + button1 + button2, { offset: [0, -20], className: 'custom-popup' }).addTo(map)
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

function redirectToSuggestionsPage() {
    // Assuming you have a suggestions page named 'suggestions.html'
    window.location.href = 'suggestions.html';
}

// should be in another file --------------

// fetch markers from the API
async function fetchMarkers() {
    ///
    //var markers = [];
    /////

    try {
      const response = await fetch(`${API_BASE_URL}${MARKERS_API_ENDPOINT}`);
      if (!response.ok) {
        throw new Error('Failed to fetch markers');
      }
  
      const markers = await response.json();

      console.log( markers);
      console.log("markers length0: " + markers.length)
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
      console.log("records0: " + records.length)
      console.log(records);
      return records;
  
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  
//   // Example: Fetch records for marker with ID 23
//   async function getRecordsForMarkerId() {
//     const markerId = 23;
  
//     try {
//       const records = await fetchRecordsForMarker(markerId);
//       // Process the records as needed
//       console.log(records);
  
//     } catch (error) {
//       console.error(error);
//     }
//   }
  
  // Call the function
  //console.log("fetchjed records")
  //fetchRecordsForMarker(23);
  
function putMarkersOnMap(){
    fetchMarkers().then(markersInJson => {
        //console.log(markersInJson.length);
        for (var i = 0; i < markersInJson.length; i++){
            //console.log(markersInJson[i].latitude + "   secs: " + (new Date()).getTime());
            createMarker(map, markersInJson[i].latitude, markersInJson[i].longitude, "hh");
        }

        //console.log("abbbbbbbbbb" + "   secs: " + (new Date()).getTime());
        //console.log(markers.length);
        markers[markers.length - 1].marker.closePopup();
    });    
}
putMarkersOnMap();

  
  // Call the function
  //getRecordsForMarkerId();
  




// // Function to process the data
// function getData() {
//     var markers = [];
    
//     // Ensure you handle the asynchronous nature of fetchMarkers
//     fetchMarkers().then(markersInJson => {
//       console.log("markers length: " + markersInJson.length)  

//       for (var i = 0; i < markersInJson.length; i++) {
        
//         markers[i] = {
//             id: markersInJson[i].id,
//             coordinates: [markersInJson[i].latitude, markersInJson[i].longitude],
//             records: [],
//             marker: null,
//         };

//         console.log(markersInJson[i].id);
//         fetchRecordsForMarker(markersInJson[i].id).then(recordsInJson =>{
//             console.log("records length: " + recordsInJson.length)
//             for (var j = 0; j < recordsInJson.length; j++){
//                 markers[i].records[j] = {
//                     description: recordsInJson[j].description,
//                     record_images: []
//                 }
//             }
//         })
//       }
  
//       console.log(markersInJson);

//       console.log("aaaaaaaaaa");
//       console.log(markers);
//     });
// }
  

///
// function getData(){
//     //records = [];
//     var markers = [];
//     var markersInJson = fetchMarkers();

//     for (var i = 0; i < markersInJson.length; i++){
//         markers[i] = 
//         {
//             coordinates: [markersInJson[i].latitude, markersInJson[i].longitude],
//             records: [],
//             marker: null,
//         }

//     }

//     console.log( markersInJson);
//     console.log(markers);
// }

// getData();






  
//-------------------------------------
  
// import { f1 } from "./getDataFromDB.js";
// after each submit, updateMarkers function will be called
// function updateMarkers(markers) {
//     // records.forEach(function (record) {
//     //     var needToCreate = true;
//     //     for (var i = 0; i < markers.length; i++){
//     //         if (markers[i].coordinates[0] == record.latitude && markers[i].coordinates[1] == record.longitude){
//     //             needToCreate = false;
//     //         }
//     //     }
//     //     if (needToCreate)
//     //         createMarker(map, record.latitude, record.longitude, record.latitude + ", " + record.longitude);
//     // });

//     // fetchMarkers();    
//     //putMarkersOnMap(fetchMarkers());
//     putMarkersOnMap();
// }
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
    //var button2 = '<button id="popupButtonAdd' + markerNr + '" onclick="togglePopup()" class="popup-button">Add new description</button>';
    // var button2 = '<button id="popupButtonAdd' + markerNr + '" onclick="addNewDescription(${lat}, ${lng})" class="popup-button">Add new description</button>';
    var button2 = `<button id="popupButtonAdd${markerNr}" onclick="addNewDescription(${lat}, ${lng})" class="popup-button">Add new description</button>`;


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


// // // var markersForHtml = [];
  
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


        var currentFileName = window.location.pathname.split('/').pop();
        console.log(currentFileName);

        var redMarkerInSuggestionsNr = localStorage.getItem('markerNrToBeRed');
        if (redMarkerInSuggestionsNr != null && currentFileName == "suggestions.html"){
            console.log("REDDD");
            markers[redMarkerInSuggestionsNr].marker.setIcon(redIcon);
        }
        console.log("NOT REDDD");

        
    });    
}
// // // putMarkersOnMap();


//------------------------------------------
// // // var addTableIsOnTheMap = false;
// Function to get the current location
function currentLocation(callback) {
    // Check if the Geolocation API is available
    if ("geolocation" in navigator) {
        // Get current location
        navigator.geolocation.getCurrentPosition(
            function (position) {
                // Coordinates object
                var coordinates = position.coords;

                // Latitude and Longitude
                var latitude = coordinates.latitude;
                var longitude = coordinates.longitude;

                console.log("Latitude: " + latitude + ", Longitude: " + longitude);

                // Invoke the callback with the coordinates
                callback([latitude, longitude]);
            },
            function (error) {
                console.error("Error getting location:", error.message);
                // Invoke the callback with null in case of an error
                callback(null);
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
        // Invoke the callback with null if geolocation is not supported
        callback(null);
    }
}

// Function to handle the "Add to Current Location" button click
function addToCurrentLocation() {
    // Implement the logic to add to the current location
    console.log('Add to Current Location clicked');
    map.removeControl(customTableControl);
    addTableIsOnTheMap = false;

    // Call currentLocation with a callback
    currentLocation(function (currentCoordinates) {
        if (currentCoordinates) {
            console.log(currentCoordinates);
            var newMarker = L.marker(currentCoordinates, { icon: redIcon}).addTo(map);
            //createMarker(map, currentCoordinates[0], currentCoordinates[1], "Current location");
            //uploadRecord(currentCoordinates);
            newMarker.bindPopup(currentCoordinates[0] + ", " + currentCoordinates[1]);//.openPopup();

            coordsForUploading = [currentCoordinates[0], currentCoordinates[1]];
            togglePopup();
        } else {
            console.log("Unable to get current location.");
        }
    });
}


// Function to handle the "Choose Location" button click
function chooseLocation() {
    map.removeControl(customTableControl);
    addTableIsOnTheMap = false;
    // Implement the logic to choose a location
    console.log('Choose Location clicked');
    var count = 0;


    // Add a click event listener to the map
    map.on('click', function (e) {
        // Remove the click event listener to prevent multiple markers on subsequent clicks
        
        
        // Get the clicked coordinates
        var lat = e.latlng.lat;
        var lng = e.latlng.lng;
        console.log(e.latlng.toString());
         // Create a draggable marker at the clicked location
         

         // Open the popup only for the first click
        if (count == 1) {
            console.log(count + "cccc");
            var newMarker = L.marker([lat, lng], { icon: redIcon, draggable: true }).addTo(map);
            //newMarker.bindPopup("Drag me!").openPopup();
            var fixPlace = `<button id="fixMarkersPlace" onclick="makeMarkerUndraggable(${newMarker._leaflet_id}, ${lat}, ${lng})" class="popup-button">Fix marker\'s place</button>`;
            // var addButton = '<button id="popupButtonAdd__" onclick="togglePopup()" class="popup-button">Add new description</button>';
            newMarker.bindPopup(`<div class="custom-popup-text">Drag me!<Br>${fixPlace}`, { offset: [10, 10], className: 'custom-popup' }).addTo(map);
            newMarker.openPopup();

        // Add dragend event listener to handle marker drag
                newMarker.on('dragend', function (event) {
                    var marker = event.target;
                    var position = marker.getLatLng();
                    console.log("Marker dragged to: " + position.lat + ", " + position.lng);
                });


                // Add dragstart event listener to open the popup during dragging
            newMarker.on('dragstart', function () {
                newMarker.openPopup();
            });

            // Add drag event listener to update the popup position during dragging
            newMarker.on('drag', function () {
                newMarker.getPopup().setLatLng(newMarker.getLatLng());
            });
        }
        if (count == 2)
            map.off('click');

        count++;

        

        // Call the function to upload the record
        //createMarker(map, e.latlng.lat, e.latlng.lng, e.latlng.toString(), 0)

        //uploadRecord(lat, lng); // Pass the coordinates to the uploadRecord function
    });
}
function setToNewDescriptionPopup(marker, lat, lng){
    // var addButton = '<button id="popupButtonAdd__" onclick="togglePopup()" class="popup-button">Add new description</button>';
    var addButton = `<button id="popupButtonAdd__" onclick="addNewDescription(${lat}, ${lng})" class="popup-button">Add new description</button>`;
    marker.setPopupContent(`<div class="custom-popup-text">${addButton}`, { offset: [10, 10], className: 'custom-popup' }).addTo(map);

}
function makeMarkerUndraggable(markerId, lat, lng) {
    var marker = map._layers[markerId];
    if (marker) {
        marker.dragging.disable();
    }

    marker.closePopup();
    setToNewDescriptionPopup(marker, lat, lng);
    //marker.closePopup();
    //marker.openPopup();


    // Delay opening the popup to ensure Leaflet has processed the changes
    setTimeout(function () {
        marker.openPopup();
        console.log("done");
    }, 10); // You can adjust the delay time as needed
    
}

// Function to create the custom button
function addButtonOnMap(customTableControl){
    // Create a button element
    var myButton = L.DomUtil.create('button', 'add-button');
    var imgElement = document.createElement('img');
    imgElement.src = 'add.png';
    imgElement.alt = 'My Image';
    imgElement.style.width = '40px'; // set your desired width
    imgElement.style.height = '40px'; // set your desired height
    myButton.appendChild(imgElement);

    // Define a custom control and add the button to it
    var customControl = L.control({ position: 'topright' });
    customControl.onAdd = function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        container.appendChild(myButton);
        return container;
    };

    // Add the custom control to the map
    customControl.addTo(map);
    
    // Add a click event listener to the button
    myButton.addEventListener('click', function () {
        // Call the function to create the custom popup
        //createCustomTable()
        if (!addTableIsOnTheMap){
            customTableControl.addTo(map);
            addTableIsOnTheMap = true;
        }
        else{
            map.removeControl(customTableControl);

            addTableIsOnTheMap = false;
        }
        
        console.log("clicked");
    });
}

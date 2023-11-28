function toggleIcon(markers, markerNrToToggle, icon){
    markers[markerNrToToggle].marker.setIcon(icon);

    for (var i = 0; i < markers.length; i++){
        var mark = markers[i];

        if (i != markerNrToToggle){
            mark.marker.setIcon(defaultIcon)
        }
    }
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
        ids: [id], // ids of all markers that are around
        coordinates: [lat, lng],
        marker: null,
    }

    var markerNr = markers.length - 1;
    markers[markerNr].marker = L.marker([lat, lng]);

    var button1 = `<br><button id="popupButtonView${markerNr}" class="popup-button" onclick="redirectToSuggestionsPage(${markerNr})">View suggestions</button>`;
    var button2 = `<button id="popupButtonAdd${markerNr}" onclick="addNewDescription(${lat}, ${lng})" class="popup-button">Add new description</button>`;

    markers[markerNr].marker.bindPopup(`<div class="custom-popup-text">${text}${button1}${button2}`, { offset: [0, -20], className: 'custom-popup' }).addTo(map);
    toggleIcon(markers, markerNr, redIcon);

    markers[markerNr].marker.on('click', function () {
        toggleIcon(markers, markerNr, redIcon);
    })

    markers[markerNr].marker.on('popupclose', function () {
        markers[markerNr].marker.setIcon(defaultIcon);
    });

    markers[markerNr].marker.openPopup();
}
  
function putMarkersOnMap(){
    fetchMarkers().then(markersInJson => {
        for (var i = 0; i < markersInJson.length; i++){
            createMarker(map, markersInJson[i].latitude, markersInJson[i].longitude, 
                         `${markersInJson[i].latitude}, ${markersInJson[i].longitude}`, markersInJson[i].id);
        }

        for (var i = 0; i < markers.length; i++){
            markersForHtml[i] = extractMarkerData(markers[i]);
            markers[i].marker.closePopup();
        }

        localStorage.setItem('markers', JSON.stringify(markersForHtml));

        var currentFileName = window.location.pathname.split('/').pop();
        console.log(currentFileName);

        var redMarkerInSuggestionsNr = localStorage.getItem('markerNrToBeRed');
        if (redMarkerInSuggestionsNr != null && currentFileName == "suggestions.html"){
            markers[redMarkerInSuggestionsNr].marker.setIcon(redIcon);
        }
    });    
}

function currentLocation(callback) {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                var coordinates = position.coords;

                var latitude = coordinates.latitude;
                var longitude = coordinates.longitude;

                // console.log("Latitude: " + latitude + ", Longitude: " + longitude);
                callback([latitude, longitude]);
            },
            function (error) {
                console.error("Error getting location:", error.message);
                callback(null);
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
        callback(null);
    }
}

async function addToCurrentLocation() {
    console.log('Add to Current Location clicked');
    map.removeControl(customTableControl);
    addTableIsOnTheMap = false;

    currentLocation(async function (currentCoordinates) {
        if (currentCoordinates) {
            console.log(currentCoordinates);
            var newMarker = L.marker(currentCoordinates, { icon: redIcon }).addTo(map);
            newMarker.bindPopup(currentCoordinates[0] + ", " + currentCoordinates[1]);

            coordsForUploading = [currentCoordinates[0], currentCoordinates[1]];

            await togglePopup();
            if (submitted){
                console.log("This was submitted");
                createMarker(map, currentCoordinates[0], currentCoordinates[1], 
                `${currentCoordinates[0]}, ${currentCoordinates[1]}`);
            }
            else{
                console.log("This was not submitted");
                map.removeLayer(newMarker);
            }
        } else {
            console.log("Unable to get the current location.");
        }
    });
}

function chooseLocation() {
    map.removeControl(customTableControl);
    addTableIsOnTheMap = false;
    console.log('Choose Location clicked');
    var count = 0;

    map.on('click', function (e) {
        var lat = e.latlng.lat;
        var lng = e.latlng.lng;
        coordsForUploading = [lat, lng];
        console.log(e.latlng.toString());
       
        if (count == 1) {
            console.log(count + "cccc");
            var newMarker = L.marker([lat, lng], { icon: redIcon, draggable: true }).addTo(map);
            var fixPlace = `<button id="fixMarkersPlace" onclick="makeMarkerUndraggable(${newMarker._leaflet_id}, ${lat}, ${lng})" class="popup-button">Fix marker\'s place</button>`;
            newMarker.bindPopup(`<div class="custom-popup-text">Drag to desired place<Br>Double-click to close<Br>${fixPlace}`, { offset: [10, 10], className: 'custom-popup' }).addTo(map);
            newMarker.openPopup();

            newMarker.on('dragend', function (event) {
                var marker = event.target;
                var position = marker.getLatLng();
                lat = position.lat;
                lng = position.lng;

                coordsForUploading = [position.lat, position.lng];
                console.log("Marker dragged to: " + position.lat + ", " + position.lng);
            });

            newMarker.on('dragstart', function () {
                newMarker.openPopup();
            });

            newMarker.on('drag', function () {
                newMarker.getPopup().setLatLng(newMarker.getLatLng());
            });

            newMarker.on('dblclick', function () {
                newMarker.removeFrom(map)
            })
        }
        if (count == 2)
            map.off('click');

        count++;
    });
}
function setToNewDescriptionPopup(marker, lat, lng){
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

    setTimeout(function () {
        document.body.addEventListener('click', function (event) {
        var addDescrButton = event.target.closest('#popupButtonAdd__');
        var fixButton = event.target.closest('#fixMarkersPlace');

        if (addDescrButton || fixButton) {
            console.log('4444444444444444  ' );
            createMarker(map, lat, lng, `${lat}, ${lng}`)
        }
        else{
            console.log('hidee  ');
            map.removeLayer(marker);
        }
        });

        marker.openPopup();
        console.log("done");
    }, 10);
    
}

function addButtonOnMap(customTableControl){
    var myButton = L.DomUtil.create('button', 'add-button');
    var imgElement = document.createElement('img');
    imgElement.src = 'add.png';
    imgElement.alt = 'My Image';
    imgElement.style.width = '40px'; 
    imgElement.style.height = '40px';
    myButton.appendChild(imgElement);

    var customControl = L.control({ position: 'topright' });
    customControl.onAdd = function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        container.appendChild(myButton);
        return container;
    };

    customControl.addTo(map);
    myButton.addEventListener('click', function () {
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

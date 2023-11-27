function convertToArrayOfCoordinates(records){
	return records.map(record => [record.latitude, record.longitude]);
}

//module.exports = convertToArrayOfCoordinates;


function redirectToSuggestionsPage(markerNr) {
    // Construct the URL with the marker ID as a query parameter
    console.log("-------------------------------------------------");
    //console.log("marker nr " + markerNr);
    localStorage.setItem(`markerNrToBeRed`, JSON.stringify(markerNr));


    const url = `suggestions.html?markerId=${markerNr}`;
    window.location.href = url;
}

function extractMarkerData(marker) {
    return {
        ids: marker.ids,
        coordinates: marker.coordinates,
        // Add other properties you want to store
    };
    
}

function createCustomTable() {
	// Create a table with two buttons
	var tableContent =
		'<table class="popup-table">' +
		'<tr><td>Choose where to put new marker:</td></tr>' +
		'<tr><td><button onclick="addToCurrentLocation()" class="popup-button">Add to Current Location</button></td></tr>' +
		'<tr><td><button onclick="chooseLocation()" class="popup-button">Choose Location</button></td></tr>' +
		'</table>';

	// Create a custom container div for the table
	var containerDiv = L.DomUtil.create('div', 'popup-table');
	containerDiv.innerHTML = tableContent;

	// Create a custom control and add the container to it
	var customTableControl = L.control({ position: 'topright' });
	customTableControl.onAdd = function (map) {
		return containerDiv;
	};

	// Add the custom control to the map
	//customTableControl.addTo(map);
	return customTableControl;
}

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


function togglePopup() {
    var overlay = document.getElementById('overlay');
    overlay.style.display = (overlay.style.display === 'none' || overlay.style.display === '') ? 'flex' : 'none';
}
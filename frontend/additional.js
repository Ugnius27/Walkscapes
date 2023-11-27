function convertToArrayOfCoordinates(records){
	return records.map(record => [record.latitude, record.longitude]);
}

function redirectToSuggestionsPage(markerNr) {
    localStorage.setItem(`markerNrToBeRed`, JSON.stringify(markerNr));

    const url = `suggestions.html?markerId=${markerNr}`;
    window.location.href = url;
}

function extractMarkerData(marker) {
    return {
        ids: marker.ids,
        coordinates: marker.coordinates,
    };
}

function createCustomTable() {
	var tableContent =
		'<table class="popup-table">' +
		'<tr><td>Choose where to put new marker:</td></tr>' +
		'<tr><td><button onclick="addToCurrentLocation()" class="popup-button">Add to Current Location</button></td></tr>' +
		'<tr><td><button onclick="chooseLocation()" class="popup-button">Choose Location</button></td></tr>' +
		'</table>';

	var containerDiv = L.DomUtil.create('div', 'popup-table');
	containerDiv.innerHTML = tableContent;

	var customTableControl = L.control({ position: 'topright' });
	customTableControl.onAdd = function (map) {
		return containerDiv;
	};

	return customTableControl;
}

function distance(point1, point2){
    return Math.sqrt(Math.pow((point1[0] - point2[0]), 2) + Math.pow((point1[1] - point2[1]), 2));
}

function markerNrThatIsInTheSameCluster(coordinates, radiusOfACluster){
    console.log(markers.length);
    for (var i = 0; i < markers.length; i++){

        if (distance(markers[i].coordinates, coordinates) <= radiusOfACluster){
            return i;
        }
    }

    return -1;
}

// function togglePopup() {
//     return new Promise(resolve => {
//         var overlay = document.getElementById('overlay');

//         if (!overlay) {
//             console.log("overlay could not be found");
//             resolve();
//             return;
//         }

//         overlay.style.display = (overlay.style.display === 'none' || overlay.style.display === '') ? 'flex' : 'none';

//         overlay.classList.toggle('active');

//         // Wait for the transition to complete (you may need to adjust the time)
//         setTimeout(() => {
//             if (!overlay.classList.contains('active')) {
//                 console.log('Overlay closed');
//                 cleanOverlayData();
//             }
//             resolve();
//         }, 300); // 300 milliseconds, adjust if needed
//     });
// }

function waitForElementWithHandler(selector) {
    return new Promise((resolve) => {
        const checkElement = () => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
            } else {
                setTimeout(checkElement, 100); // Check again after a short delay
            }
        };

        checkElement();
    }).then((element) => {
        return new Promise((resolve) => {
            const clickHandler = () => {
                //console.log('Close button clicked');
                console.log(`${selector} button clicked`);
                // Remove the click event listener after it's triggered once
                element.removeEventListener('click', clickHandler);
                resolve();
            };

            element.addEventListener('click', clickHandler);
        });
    });
}

async function togglePopup() {
    var overlay = document.getElementById('overlay');

    if (!overlay) {
        console.log("overlay could not be found");
        return;
    }

    overlay.style.display = (overlay.style.display === 'none' || overlay.style.display === '') ? 'flex' : 'none';

    overlay.classList.toggle('active');

    // Set up a handler for the 'transitionend' event
    const transitionEndHandler = () => {
        // Call the callback if it exists
        if (overlayClosedCallback != null) {
            overlayClosedCallback();
            console.log('Overlay closeddd');
            cleanOverlayData();
        }

        // Remove the event listener to avoid memory leaks
        overlay.removeEventListener('transitionend', transitionEndHandler);
    };

    // Add an event listener for the 'transitionend' event
    overlay.addEventListener('transitionend', transitionEndHandler);

    // Wait until closeButton is available and clickHandler has been executed
    // await (waitForElementWithHandler('#close') || waitForElementWithHandler('#submit'));
    await Promise.race([waitForElementWithHandler('#close'), waitForElementWithHandler('#submit')]);

}
// function waitForOverlayClosed(callback) {
//     overlayClosedCallback = callback;
// }



function addNewDescription(lat, lng) {
    coordsForUploading = [lat, lng];
    togglePopup();
}

function closeButtonClicked(){
    submitted = false;
    console.log(submitted);
    togglePopup();
}

function submitButtonClicked(){
    submitted = true;
    console.log(submitted);
    uploadRecord(coordsForUploading[0], coordsForUploading[1])
    //document.getElementById('overlay').style.display = 'none';

    // var overlay = document.getElementById('overlay');

    // if (!overlay) {
    //     console.log("overlay could not be found");
    //     return;
    // }

    // console.log("ttttttttttttttttt");
    // overlay.style.display = (overlay.style.display === 'none' || overlay.style.display === '') ? 'flex' : 'none';
}

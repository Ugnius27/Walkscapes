// AddMarkerButton.jsx

import React, { useState, useEffect, useContext, createRef, createContext } from 'react';
import $ from 'jquery';

import L, { Marker, map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../popupsLeaflet.css'
import ReactDOMServer from 'react-dom/server';

// import { mapRef, RED_ICON } from '../../App.jsx';
import { DEFAULT_ICON, RED_ICON } from '../../App.jsx';

import { ADD_MARKER_MODAL_ID, CHOOSE_LOCATION_MESSAGE_ID,
		 ADD_TO_CURR_LOCATION_MESSAGE_ID, useMarkerState} from '../Map/Map.jsx';

import { UPLOAD_MODAL_ID, BUTTON_TO_SHOW_UPLOAD_MODAL } from '../UploadModal/UploadModal.jsx';

import * as Fade from '../FadeModal/FadeModal.jsx';
import * as Markers from '../Challenges/Markers.jsx'
import UploadModal from '../UploadModal/UploadModal.jsx';

import addMarkerImage from './add.png'; // Update the path accordingly
import { uploadRecord } from '../UploadModal/UploadDataToDB.js';

const ADD_MARKER_BUTTON_ID = 'addMarkerButton';
const CHOOSE_LOCATION_BUTTON_ID = 'ChooseLocationButton';

export function toggleAddMarkerButton(){
	const addMarkerButtonElement = document.getElementById(ADD_MARKER_BUTTON_ID);
	if (!addMarkerButtonElement){
		console.log("Can't hide button because it is not found");
			return;
	}

	addMarkerButtonElement.style.display = (addMarkerButtonElement.style.display == 'none') ? 'flex' : 'none';
}

const AddMarkerButton = ({mapRef, activePolygons, polygonIds, markerIds, setMarkerIds, lastMarkerId, setLastMarkerId,
isNewSuggestionAdded, setIsNewSuggestionAdded}) => {
	// var lastMarkerId = -1;
	// const [lastMarkerId, setLastMarkerId] = useState(-1);

	const { canAddNewMarker, setCanAddNewMarker } = useMarkerState();

	useEffect(() => {
		// // console.log('Effect: 7777777777777777777777');
		// // console.log(markerIds);
		// lastMarkerId = markerIds[markerIds.length - 1];
		// console.log('AddMarkerButton last: ', lastMarkerId);
		const newLastMarkerId = markerIds.length > 0 ? markerIds[markerIds.length - 1] : -1;
		setLastMarkerId(newLastMarkerId);
		// console.log('AddMarkerButton last: ', newLastMarkerId);
		// // console.log('mapRef in another func: ', mapRef);

	  }, [markerIds]);

	function bindPopupChoosePlace(marker, lat, lng, mapRef){

		marker.bindPopup(
			`<div class="d-flex justify-content-center">
				Coordinates: (${lat.toFixed(5)}, ${lng.toFixed(5)})
			</div>
			<div 
				class="d-flex justify-content-center"
				style="margin-top: 5px; margin-bottom: 5px; font-size: 14px;"
			>
				Click twice on the marker to remove it
			</div>
			${FixMarkersPlaceButton(marker._leaflet_id, mapRef)}`).addTo(mapRef.current);

		marker.openPopup();
	}

	function chooseLocation(mapRef) {  // TODO: finish
		console.log('Choose location clicked');
		setCanAddNewMarker(currentState => {
			// console.log("Marker can be added");
			return true;
		});

		toggleAddMarkerButton();                         	  // hide
		Fade.toggleFadeOverlay();                             // show
		Fade.toggleFadeMessage(CHOOSE_LOCATION_MESSAGE_ID);   // show
		mapRef.current.off('click');


		mapRef.current.on('click', function (e) {
			var count = 0;

			mapRef.current.off('click');
			var lat = e.latlng.lat;
			var lng = e.latlng.lng;
			
			var pressedAtCoords = [lat, lng];

			// Markers.isMarkerInThePolygon()
			// console.log(pressedAtCoords);
			
			// console.log(setCanAddNewMarker);
			setCanAddNewMarker(currentState => {
				count++;
				// console.log("1. Checking curent state before deciding: ", currentState, ' ', canAddNewMarker, ' ', count);

				if (!currentState || count > 1){
					console.log("Can't add new marker");
					return currentState;
				}
					// console.log("elsee ", count);
				var newMarker = L.marker([lat, lng], { icon: RED_ICON, draggable: true }).addTo(mapRef.current);
				bindPopupChoosePlace(newMarker, lat, lng, mapRef);
				setMarkerIds((prevMarkerIds) => [...prevMarkerIds, newMarker._leaflet_id]);
				// console.log('its id: ', newMarker._leaflet_id, ' coords: ', [lat, lng]);

				newMarker.on('dragend', function (event) {
					var marker = event.target;
					
					var position = marker.getLatLng();
					lat = position.lat;
					lng = position.lng;
					
					pressedAtCoords = [position.lat, position.lng];
					
					bindPopupChoosePlace(newMarker, lat, lng, mapRef);
					// console.log("Marker dragged to: " + position.lat + ", " + position.lng);
					// console.log("m id: ", newMarker._leaflet_id);
				
				
				});

				newMarker.on('dblclick', function () { // TODO: hideFade sometimes appears instead of dissapearing 
					newMarker.removeFrom(mapRef.current)

					Fade.hideFade(CHOOSE_LOCATION_MESSAGE_ID, setCanAddNewMarker, mapRef, markerIds);
					setMarkerIds((prevMarkerIds) => prevMarkerIds.slice(0, -1));

					// console.log("DOUBLE-CL");
				})
				return false; // Update the state
			
			});
			
		});

		
	}

	function FixMarkersPlaceButton(markerId){
		return (
			`<div class="d-flex justify-content-center">
				<button 
					onclick="fixMarkersPlace('${markerId}', '1')"  
					class="popup-button"
					data-toggle="modal"
					data-target="#${UPLOAD_MODAL_ID}"
				>
					Fix marker\'s place
				</button>
			</div>`
		)
	}

	return (
		<>
		<button
			id={ADD_MARKER_BUTTON_ID}
			type="button"
			className="add-button rounded-1"
			onClick={() => chooseLocation(mapRef)}
			style={{display: 'flex'}}
		>
		<img className='img-fluid'
			src = {addMarkerImage}
			alt = "Add new marker"
		/>
		</button>
		
		<div>
		<UploadModal 
			map={mapRef.current}
			lastSubmittedMarkerId={lastMarkerId}
			isNewSuggestionAdded={isNewSuggestionAdded}
			setIsNewSuggestionAdded={setIsNewSuggestionAdded}
		/>
		</div>
		
		</>
	);
}

export default AddMarkerButton;
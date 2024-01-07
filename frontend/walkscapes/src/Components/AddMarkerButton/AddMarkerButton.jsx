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
import UploadModal from '../UploadModal/UploadModal.jsx';

import addMarkerImage from './add.png'; // Update the path accordingly

const ADD_MARKER_BUTTON_ID = 'addMarkerButton';
const CHOOSE_LOCATION_BUTTON_ID = 'ChooseLocationButton';
const ADD_TO_CURR_LOCATION_BUTTON_ID = 'AddToCurrLocationButton';

// const addMarkerModalRef = createRef();
// var canAddNewMarker = true;

function addToCurrentLocation() { // TODO
	console.log('Add to current location clicked');
}

// export function A() {
//     // Your implementation here
//     console.log("Fixing marker's place");
//     // Additional logic to fix the marker's place
// };

// Example: Define A in the global scope
// // window.fixMarkersPlace = function(markerId, mapRef) {
// //     console.log("Fixing marker's place ", markerId);
// // 	// console.log(mar);
// //     // Additional logic to fix the marker's place
// // 	// console.log(markerId);
// // 	// markerId = parseInt(markerId, 10);
// // 	// console.log(markerId);
// // 	// var marker = mapRef.current._layers[markerId];
// //     // if (marker) {
// //     //     marker.dragging.disable();
// //     // }

// //     // return -1;
// //     // marker.closePopup();
// // };

// // // function FixMarkersPlaceButton(markerId, mapRef){
// // // 	return (
// // // 		`<div class="d-flex justify-content-center">
// // // 			<button 
// // // 				onclick="fixMarkersPlace('${markerId}', '${mapRef}')" 
// // // 				class="popup-button"
// // // 			>
// // // 				Fix marker\'s place
// // // 			</button>
// // // 		</div>`
// // // 	)
// // // }




// const FixMarkersPlaceButton = () => {
// 	return (
// 		// <button>A</button>
// 		<div 
// 			className='row justify-content-center' 
// 			style={{zIndex: 985}}
// 		>
// 			<button
// 				// id="fixMarkersPlace"
// 				className='popup-button'
// 				onClick={() => fixMarkersPlace()}
// 			>
// 				Fix marker's place
// 			</button>
// 		</div>
// 	);
// }

// function A(){
// 	{/* <div 
// 			className='row' 
// 			style={{zIndex: 985}}
// 		>
// 			<button
// 				className='popup-button'
// 				onClick={() => fixMarkersPlace(marker)}
// 			>
// 				Fix marker's place
// 			</button>
// 		</div> */}
// }


export function toggleAddMarkerButton(){
	const addMarkerButtonElement = document.getElementById(ADD_MARKER_BUTTON_ID);
	if (!addMarkerButtonElement){
		console.log("Can't hide button because it is not found");
			return;
	}

	addMarkerButtonElement.style.display = (addMarkerButtonElement.style.display == 'none') ? 'flex' : 'none';
}

const ModalButton = ({ id, text, align, sizeOfColumn, func, mapRef }) => {
	const handleClick = (event) => {
	//   const buttonId = event.target.id;
	//   console.log(`Button with id ${buttonId} clicked.`);
	// Rest of your code...
	func(event, mapRef); // Call the original func passed as a prop
	};

	return (
	<div className={`col-${sizeOfColumn} d-flex justify-content-${align}`}>
		<button 
		id={id}
		onClick={handleClick}
		className="popup-button"
		>
		{text}
		</button>
	</div>
	);
}

const CloseButton = ({mbSize}) => {
	return (
		<div className={`col-1`}>
			<button
				type="button"
				className={`btn-close mb-${mbSize}`}
				data-bs-dismiss="modal"
				aria-label="Close"
			></button>
		</div>
	);
}

function bindCasualPopup(marker, lat, lng, mapRef){
	marker.bindPopup(`Coordinates: (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
}

const AddMarkerButton = ({mapRef, markerIds, setMarkerIds}) => {
	const { canAddNewMarker, setCanAddNewMarker } = useMarkerState();

	useEffect(() => {
		console.log('Effect: 7777777777777777777777');
		console.log(markerIds);
	  }, [markerIds]);


	window.fixMarkersPlace = function(markerId) {
		console.log("Fixing marker's place ", markerId);

		var marker = mapRef.current._layers[markerId];
		if (!marker) {
			console.log("Can't find marker to make in undragable");
			return;
		}

		var coordinates = marker.getLatLng();
		marker.dragging.disable();
		marker.closePopup();
		bindCasualPopup(marker, coordinates.lat, coordinates.lng, mapRef);

		Fade.hideFade(CHOOSE_LOCATION_MESSAGE_ID, setCanAddNewMarker, mapRef, markerIds, setMarkerIds);
		// marker.setIcon(DEFAULT_ICON); /////////////////////////
		marker.off('dblclick'); 
		// canAddNewMarker = true;
		
		var modal = document.getElementById(UPLOAD_MODAL_ID);
		console.log("MODAL: ");
		console.log(modal);

		var buttonToClick = document.getElementById(BUTTON_TO_SHOW_UPLOAD_MODAL);

		if (buttonToClick) {
			// Trigger a click on the button
			buttonToClick.click();

			
			const myValue = buttonToClick.dataset.lat;
			
			// console.log('my value (lat):');
			// console.log(myValue); // Outputs: "42"

			buttonToClick.dataset.lat = coordinates.lat;
			buttonToClick.dataset.lng = coordinates.lng;
			buttonToClick.dataset.markerId = marker._leaflet_id;
			console.log(buttonToClick.dataset.markerId);

			var variable = buttonToClick.dataset.markerId;

			if (typeof variable === 'number' && Number.isInteger(variable)) {
				console.log( 'integer');
			} else if (typeof variable === 'string') {
				console.log( 'string');
			} else {
				console.log( 'unknown');
			}

			// ReactDOMServer.renderToString(buttonToClick.dataset.marker).setIcon(DEFAULT_ICON);
			// console.log(buttonToClick.dataset.lat);
		  }
	}
	
	function bindPopupChoosePlace(marker, lat, lng, mapRef){

		marker.bindPopup(`Coordinates: (${lat.toFixed(5)}, ${lng.toFixed(5)}) 
										${FixMarkersPlaceButton(marker._leaflet_id, mapRef)}`).addTo(mapRef.current);
		marker.openPopup();
	}


	function chooseLocation(event, mapRef) {  // TODO: finish
		console.log('Choose location clicked');
		console.log('id: ', event.target.id);

		setCanAddNewMarker(currentState => {
			console.log("Marker can be added");
			return true;
		});

		// if (addMarkerModalRef.current) {
		// 	console.log(addMarkerModalRef.current);
		// }

		toggleAddMarkerButton();                         	  // hide
		Fade.toggleFadeOverlay();                             // show
		Fade.toggleFadeMessage(CHOOSE_LOCATION_MESSAGE_ID);   // show
		// setCanAddNewMarker(false);
		mapRef.current.off('click');
		// setCanAddNewMarker(currentState => {
		// 	console.log('set to true', currentState, canAddNewMarker);
		// 	return true;
		// });

		mapRef.current.on('click', function (e) {
			var count = 0;

			mapRef.current.off('click');
			var lat = e.latlng.lat;
			var lng = e.latlng.lng;
			
			var pressedAtCoords = [lat, lng];
			console.log(pressedAtCoords);


			// var marker = L.marker(pressedAtCoords, { icon: RED_ICON }).addTo(mapRef.current);
			// marker.bindPopup(`Coordinates: (${lat.toFixed(5)}, ${lng.toFixed(5)})`);

			// toggleAddMarkerButton();                              // show
			// Fade.toggleFadeOverlay();                             // hide
			// Fade.toggleFadeMessage(CHOOSE_LOCATION_MESSAGE_ID);   // hide
			// if (!canAddNewMarker){
			// 	console.log("Can't add new marker");
			// 	return;
			// }
			// console.log("uuuuuuuuuuu");

			
			// setCanAddNewMarker(false);

			// console.log("TTTTTTTTTT  ", canAddNewMarker);
			
			console.log(setCanAddNewMarker);
			setCanAddNewMarker(currentState => {
				count++;
				console.log("1. Checking curent state before deciding: ", currentState, ' ', canAddNewMarker, ' ', count);
				// console.log("can add new marker: ", currentState);

				if (!currentState || count > 1){
					console.log("Can't add new marker");
					return currentState;
				}
					console.log("elsee ", count);
				var newMarker = L.marker([lat, lng], { icon: RED_ICON, draggable: true }).addTo(mapRef.current);
				bindPopupChoosePlace(newMarker, lat, lng, mapRef);
				// setMarkerIds((markerIds) => [...markerIds, newMarker._leaflet_id]);
				setMarkerIds((prevMarkerIds) => [...prevMarkerIds, newMarker._leaflet_id]);

				


				newMarker.on('dragend', function (event) {
					var marker = event.target;
					
					var position = marker.getLatLng();
					lat = position.lat;
					lng = position.lng;
					
					pressedAtCoords = [position.lat, position.lng];
					
					// newMarker.bindPopup(`Coordinates: (${lat.toFixed(5)}, ${lng.toFixed(5)}) 
					// 						${FixMarkersPlaceButton(newMarker._leaflet_id)}`).addTo(mapRef.current);
					// newMarker.openPopup();
					bindPopupChoosePlace(newMarker, lat, lng, mapRef);
					console.log("Marker dragged to: " + position.lat + ", " + position.lng);
					console.log("m id: ", newMarker._leaflet_id);
				
				
				});

				newMarker.on('dblclick', function () { // TODO: hideFade sometimes appears instead of dissapearing 
					newMarker.removeFrom(mapRef.current)

					Fade.hideFade(CHOOSE_LOCATION_MESSAGE_ID, setCanAddNewMarker, mapRef, markerIds);
					setMarkerIds((prevMarkerIds) => prevMarkerIds.slice(0, -1));

					// setMarkerIds((prevMarkerIds) => {
					// 	var markersIds = [];
					  
					// 	for (let i = 0; i < prevMarkerIds.length - 1; i++) {
					// 	  markersIds = [...markersIds, prevMarkerIds[i]];
					// 	}
					  
					// 	return markersIds;
					// });

					console.log("DOUBLE-CL");
				})
				return false; // Update the state
			
			});
			

			// setCanAddNewMarker(currentState => {
			// 	console.log("iiiiiiiiiiii ", currentState);
			// 	return false; // Update the state
			// });
			// console.log("can add new marker 2: ", canAddNewMarker);
			
		
			
		});

		
	}

	// useEffect(() => {
	// 	console.log("iiiiiiiiiiii ", canAddNewMarker);
	// }, [canAddNewMarker]);
	

	const AddMarkerModalBody = ({mapRef}) => {
		return (
			<div className="modal-body">

				<div className="row align-items-center justify-content-end">
					<div className="col-1"></div>
					<div className="col-10 text-center mb-2">
						<h5>Choose where to put new marker</h5>
					</div>
						<CloseButton mbSize={3} />
				</div>

				<div className="row">
					<ModalButton
						id={ADD_TO_CURR_LOCATION_BUTTON_ID}
						text='Add to Current Location'
						align='end'
						sizeOfColumn={6}
						func={addToCurrentLocation}
						mapRef={mapRef}
					/>
					<ModalButton
						id={CHOOSE_LOCATION_BUTTON_ID}
						text='Choose location'
						align='start'
						sizeOfColumn={6}
						func={chooseLocation}
						mapRef={mapRef}
					/>
				</div>
			</div>
		);
	}

	function FixMarkersPlaceButton(markerId){
		return (
			`<div class="d-flex justify-content-center">
				<button 
					onclick="fixMarkersPlace('${markerId}')" 
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
			data-bs-toggle="modal"
			data-bs-target={`#${ADD_MARKER_MODAL_ID}`}
			style={{display: 'flex'}}
		>
		<img className='img-fluid'
			src = {addMarkerImage}
			alt = "Add new marker"
		/>
		</button>
		


		<div>
		<UploadModal map={mapRef.current}/>
		</div>




		<div
			className="modal fade"
			id={`${ADD_MARKER_MODAL_ID}`}
			// ref={addMarkerModalRef}
			tabIndex="-1"
			aria-labelledby={`#${ADD_MARKER_MODAL_ID}Label`} // "exampleModalLabel"
			aria-hidden="false"
			data-bs-show={true}
			data-bs-dismiss='modal'
			style={{ position: 'absolute', top: '10px', right: '10px'}}
		>
			<div className="modal-dialog">
				<div className="modal-content">
					<AddMarkerModalBody mapRef={mapRef}/>
				</div>
			</div>
		</div>
		</>
	);
}

export default AddMarkerButton;
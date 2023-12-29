// ComponentsCreating.jsx
import React, {useState, useEffect, useContext, createRef, createContext} from 'react';
import ReactDOM from 'react-dom';


import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import addMarkerImage from './add.png';
import {mapRef, ADD_MARKER_MODAL_ID,
		CHOOSE_LOCATION_MESSAGE_ID,
		ADD_TO_CURR_LOCATION_MESSAGE_ID,
		RED_ICON} from './App.jsx';

const ADD_MARKER_BUTTON_ID = 'addMarkerButton';
const CHOOSE_LOCATION_BUTTON_ID = 'ChooseLocationButton';
const ADD_TO_CURR_LOCATION_BUTTON_ID = 'AddToCurrLocationButton';


const addMarkerModalRef = createRef();

function addToCurrentLocation() { // TODO
	console.log('Add to current location clicked');
  }
  
function chooseLocation(event) {  // TODO: finish
	console.log('Choose location clicked');
	console.log('id: ', event.target.id);

	if (addMarkerModalRef.current) {
		console.log(addMarkerModalRef.current);
	}

	toggleAddMarkerButton();                         // hide
	toggleFadeOverlay();                             // show
	toggleFadeMessage(CHOOSE_LOCATION_MESSAGE_ID);   // show

	mapRef.current.on('click', function (e) {
		var lat = e.latlng.lat;
		var lng = e.latlng.lng;
		
		var pressedAtCoords = [lat, lng];
		console.log(pressedAtCoords);
	
		var marker = L.marker(pressedAtCoords, { icon: RED_ICON }).addTo(mapRef.current);
		marker.bindPopup(`Coordinates: (${lat.toFixed(5)}, ${lng.toFixed(5)})`);

		toggleAddMarkerButton();                         // show
		toggleFadeOverlay();                             // hide
		toggleFadeMessage(CHOOSE_LOCATION_MESSAGE_ID);   // hide
	});
}



// function chooseLocation() {
//     // mapRef.current.removeControl(customTableControl);
//     // addTableIsOnTheMap = false;
//     console.log('Choose Location clicked');
//     // var count = 0;
// 	// mapRef.current.on('click', function (e) {
// 	// 	var lat = e.latlng.lat;
//     //     var lng = e.latlng.lng;

// 	// 	var pressedAtCoords = [lat, lng];
// 	// 	console.log(pressedAtCoords);
// 	// });



//     // mapRef.current.on('click', function (e) {
//     //     var lat = e.latlng.lat;
//     //     var lng = e.latlng.lng;
//     //     coordsForUploading = [lat, lng];
//     //     console.log(e.latlng.toString());
       
//     //     if (count == 1) {
//     //         console.log(count + "cccc");
//     //         var newMarker = L.marker([lat, lng], { icon: redIcon, draggable: true }).addTo(mapRef.current);
//     //         var fixPlace = `<button id="fixMarkersPlace" onclick="makeMarkerUndraggable(${newMarker._leaflet_id}, ${lat}, ${lng})" class="popup-button">Fix marker\'s place</button>`;
//     //         newMarker.bindPopup(`<div class="custom-popup-text">Drag to desired place<Br>Double-click to close<Br>${fixPlace}`, { offset: [10, 10], className: 'custom-popup' }).addTo(mapRef.current);
//     //         newMarker.openPopup();

//     //         newMarker.on('dragend', function (event) {
//     //             var marker = event.target;
//     //             var position = marker.getLatLng();
//     //             lat = position.lat;
//     //             lng = position.lng;

//     //             coordsForUploading = [position.lat, position.lng];
//     //             console.log("Marker dragged to: " + position.lat + ", " + position.lng);
//     //         });

//     //         newMarker.on('dragstart', function () {
//     //             newMarker.openPopup();
//     //         });

//     //         newMarker.on('drag', function () {
//     //             newMarker.getPopup().setLatLng(newMarker.getLatLng());
//     //         });

//     //         newMarker.on('dblclick', function () {
//     //             newMarker.removeFrom(mapRef.current)
//     //         })
//     //     }
//     //     if (count == 2)
// 	// 		mapRef.current.off('click');

//     //     count++;
//     // });
// }

// function ModalButton({id, text, align, sizeOfColumn, func}){
// 	return (
// 		<div className={`col-${sizeOfColumn} d-flex justify-content-${align}`}>
// 			<button 
// 				id={id}
// 				onClick={func}
// 				className="popup-button">
// 					{text}
// 			</button>
// 		</div>
// 	);
// }

function ModalButton({ id, text, align, sizeOfColumn, func }) {
	const handleClick = (event) => {
	//   const buttonId = event.target.id;
	//   console.log(`Button with id ${buttonId} clicked.`);
	  // Rest of your code...
	  func(event); // Call the original func passed as a prop
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
  

export function CloseButton({mbSize}){
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

function AddMarkerModalBody(){
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
				/>
				<ModalButton
					id={CHOOSE_LOCATION_BUTTON_ID}
					text='Choose location'
					align='start'
					sizeOfColumn={6}
					func={chooseLocation}
				/>
			</div>
		</div>
	);
}

export function AddMarkerTable(){
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

		<div
			className="modal fade"
			id={`${ADD_MARKER_MODAL_ID}`}
			ref={addMarkerModalRef}
			tabIndex="-1"
			aria-labelledby={`#${ADD_MARKER_MODAL_ID}Label`} // "exampleModalLabel"
			aria-hidden="false"
			data-bs-show={true}
			data-bs-dismiss='modal'
			style={{ position: 'absolute', top: '10px', right: '10px'}}
		>
			<div className="modal-dialog">
				<div className="modal-content">
					<AddMarkerModalBody/>
				</div>
			</div>
		</div>
		</>
	);
}

export function toggleFadeOverlay(){
	const fadeModalElement = document.getElementById('fadeModal');
	if (!fadeModalElement){
		console.log("Unable to hide fade overlay. Fade overlay is not found");
		return;
	}

	fadeModalElement.style.display = fadeModalElement.style.display == 'none' ? 'flex' : 'none';
}

export function hideFade(messageId){
	toggleFadeOverlay();
	toggleAddMarkerButton();
	toggleFadeMessage(messageId);
}

export function FadeModal(){

	return (
		<>
      {/* Modal Overlay */}
      <div
        className='modal-overlay'//{`modal-overlay${isFadeModalVisible ? ' visible' : ''}`}
		id='fadeModal'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha value for transparency
          zIndex: 980, // Ensure the overlay is above other content
		  display: 'none'
		// display: 'flex'
        }}
      >
		
	  </div>
    	</>
	);
}

export function toggleAddMarkerButton(){
	const addMarkerButtonElement = document.getElementById(ADD_MARKER_BUTTON_ID);
	if (!addMarkerButtonElement){
		console.log("Can't hide button because it is not found");
		return;
	}

	addMarkerButtonElement.style.display = (addMarkerButtonElement.style.display == 'none') ? 'flex' : 'none';
}

export function toggleFadeMessage(messageId){
	const messageElement = document.getElementById(messageId);
	if (!messageElement){
		console.log("Can't toggle message because it is not found");
		return;
	}

	messageElement.style.display = messageElement.style.display == 'none' ? 'flex' : 'none';
}


export function MessageOnFadeOverlay({ id, text }) {
	console.log("Message id (0): ", id);

	return (
		<>
		<div 
			className='mt-5 flex-column justify-content-center align-items-center'
			style={{zIndex: 985, display: 'none'}}
			// id='ChooseLocationMessage'
			id={id}
		>
			<div className='row'>
				<h4
					style={{zIndex: 985, color: '#55c95a'}}
				>
					{text}
				</h4>
			</div>
			<div 
				className='row' 
				style={{zIndex: 985}}
			>
				<button
					className='popup-button'
					onClick={() => hideFade(id)}
				>
					Go back
				</button>
			</div>
	
		</div>
		</>
	);
}
  
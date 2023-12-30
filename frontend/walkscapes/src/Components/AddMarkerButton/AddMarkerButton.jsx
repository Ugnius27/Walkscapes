import React, { useState, useEffect, useContext, createRef, createContext } from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../popupsLeaflet.css'

import { mapRef, RED_ICON } from '../../App.jsx';
import { ADD_MARKER_MODAL_ID,
		 CHOOSE_LOCATION_MESSAGE_ID,
		 ADD_TO_CURR_LOCATION_MESSAGE_ID
		 } from '../Map/Map.jsx';

import * as Fade from '../FadeModal/FadeModal.jsx';

import addMarkerImage from './add.png'; // Update the path accordingly

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
	Fade.toggleFadeOverlay();                             // show
	Fade.toggleFadeMessage(CHOOSE_LOCATION_MESSAGE_ID);   // show

	mapRef.current.on('click', function (e) {
		var lat = e.latlng.lat;
		var lng = e.latlng.lng;
		
		var pressedAtCoords = [lat, lng];
		console.log(pressedAtCoords);
	
		var marker = L.marker(pressedAtCoords, { icon: RED_ICON }).addTo(mapRef.current);
		marker.bindPopup(`Coordinates: (${lat.toFixed(5)}, ${lng.toFixed(5)})`);

		toggleAddMarkerButton();                         // show
		Fade.toggleFadeOverlay();                             // hide
		Fade.toggleFadeMessage(CHOOSE_LOCATION_MESSAGE_ID);   // hide
	});
}

const ModalButton = ({ id, text, align, sizeOfColumn, func }) => {
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

const AddMarkerModalBody = () => {
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

export function toggleAddMarkerButton(){
	const addMarkerButtonElement = document.getElementById(ADD_MARKER_BUTTON_ID);
	if (!addMarkerButtonElement){
		console.log("Can't hide button because it is not found");
		return;
	}

	addMarkerButtonElement.style.display = (addMarkerButtonElement.style.display == 'none') ? 'flex' : 'none';
}

const AddMarkerButton = () => {
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

export default AddMarkerButton;
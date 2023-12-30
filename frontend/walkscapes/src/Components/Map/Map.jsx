import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import AddMarkerButton from '../AddMarkerButton/AddMarkerButton';

import * as Fade from '../FadeModal/FadeModal.jsx';

import { mapRef, DEFAULT_ICON } from '../../App.jsx';

export const ADD_MARKER_MODAL_ID = 'AddMarkerModal';
export const CHOOSE_LOCATION_MESSAGE_ID = 'ChooseLocationMessage';
export const ADD_TO_CURR_LOCATION_MESSAGE_ID = 'AddToCurrLocationMessage';


export function initializeMap(mapContainer, center, mapRef) {
	// if(mapContainer.current){
	// 	console.log(mapContainer.current);
	// }else{
	// 	console.log("no");
	// }

	if (!mapContainer.current || mapRef.current) return;

	// console.log("hih");
  
	var map = L.map(mapContainer.current).setView(center, 15);
	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	  maxZoom: 20,
	}).addTo(map);
  
	var marker = L.marker(center, { icon: DEFAULT_ICON }).addTo(map);
	marker.bindPopup("Center");

	mapRef.current = map; // Save the map instance to the ref
}
  
export function addButtonOnMap(customTableControl, map, addTableIsOnTheMap) {
	if (!addTableIsOnTheMap) {
		customTableControl.addTo(map);
		addTableIsOnTheMap = true;
	} 
	else {
		map.removeControl(customTableControl);
		addTableIsOnTheMap = false;
	}
  
	console.log('clicked');

	return addTableIsOnTheMap;
}

const Map = ({mapContainer}) => {
	return (
		<>
		<div 
            className='m-3 border border-dark border-2'
            ref={mapContainer} 
            style={{ height: '350px', zIndex: 1000 }} 
            id='map'
		>
        </div>

		<AddMarkerButton/>
		<Fade.MessageOnFadeOverlay
			id = {CHOOSE_LOCATION_MESSAGE_ID}
			text = {`Click on the map to choose location`}
		/>
		</>
	);
}

export default Map;
// Map.jsx

import React, { useEffect, useState } from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import AddMarkerButton from '../AddMarkerButton/AddMarkerButton';

import * as Fade from '../FadeModal/FadeModal.jsx';
import * as Markers from '../Challenges/Markers.jsx'

import { DEFAULT_ICON } from '../../App.jsx';
import { BUTTON_TO_SHOW_UPLOAD_MODAL } from '../UploadModal/UploadModal.jsx';
import Challenges from '../Challenges/Challenges.jsx';

export const ADD_MARKER_MODAL_ID = 'AddMarkerModal';
export const CHOOSE_LOCATION_MESSAGE_ID = 'ChooseLocationMessage';
export const ADD_TO_CURR_LOCATION_MESSAGE_ID = 'AddToCurrLocationMessage';

export const useMarkerState = () => {
	const [canAddNewMarker, setCanAddNewMarker] = useState(true);
  
	return { canAddNewMarker, setCanAddNewMarker };
};

export function initializeMap(mapContainer, center, mapRef) {
	if (!mapContainer.current || mapRef.current) return;
  
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
  
	// console.log('clicked');

	return addTableIsOnTheMap;
}

const Map = ({mapContainer, mapRef}) => {
	// var markerIds = [];
	const [challengesData, setChallengesData] = useState(null);
	const [polygonIds, setPolygonIds] = useState([]);
	const [markerIds, setMarkerIds] = useState([]);
	const { canAddNewMarker, setCanAddNewMarker } = useMarkerState();

	// // // useEffect(() => {
	// // // 	console.log(markerIds);
	// // // }, [markerIds]);

	const santaka = [54.89984180616253, 23.961551736420333];
    // mapRef.current - main map


  	useEffect(() => {
		initializeMap(mapContainer, santaka, mapRef);   
  	}, []);

	window.fixMarkersPlace = function(markerId) {
		var activePolygons=
			challengesData?.filter(challenge => challenge.is_active)
			.map(challenge => challenge.polygon) || [];
		

		// console.log("Fixing marker's place ", markerId, ' ', mapRef, activePolygons);
		
		
		var marker = mapRef.current._layers[markerId];
		if (!marker) {
			console.log("Can't find marker to make in undragable");
			return;
		}
	
		var coordinates = marker.getLatLng();
		// console.log('f coord: ', coordinates);
		if (!Markers.isMarkerAtLeastInOnePolygon([coordinates.lat, coordinates.lng], activePolygons)){
			window.alert('Marker must be in an active polygon!');
			return;
		}
	
		marker.dragging.disable();
		marker.closePopup();
		Markers.bindFixedMarkersPopup(marker, coordinates.lat, coordinates.lng, mapRef);
	
		Fade.hideFade(CHOOSE_LOCATION_MESSAGE_ID, setCanAddNewMarker, mapRef, markerIds, setMarkerIds);
		marker.off('dblclick'); 
	
		var buttonToClick = document.getElementById(BUTTON_TO_SHOW_UPLOAD_MODAL);
	
		if (buttonToClick) {
			buttonToClick.click();			
	
			buttonToClick.dataset.lat = coordinates.lat;
			buttonToClick.dataset.lng = coordinates.lng;
			buttonToClick.dataset.markerId = marker._leaflet_id;
		}
	}
	

	return (
		<>
		<div 
            className='m-3 border border-dark border-2'
            ref={mapContainer} 
            style={{ height: '350px', zIndex: 1000 }} 
            id='map'
		>
        </div>

		<AddMarkerButton 
			mapRef={mapRef}
			polygonIds={polygonIds}
			setPolygonIds={setPolygonIds}
			activePolygons={
				challengesData?.filter(challenge => challenge.is_active)
				.map(challenge => challenge.polygon) || []
			}
			markerIds={markerIds}
			setMarkerIds={setMarkerIds}
		/>

		<Fade.MessageOnFadeOverlay
			id = {CHOOSE_LOCATION_MESSAGE_ID}
			text = {`Click on the map to choose location`}
      		setCanAddNewMarker={setCanAddNewMarker}
			mapRef={mapRef}
			markerIds={markerIds}
			setMarkerIds={setMarkerIds}
		/>

		<Challenges 
			mapRef={mapRef}
			challengesData={challengesData}
			setChallengesData={setChallengesData}
			polygonIds={polygonIds}
			setPolygonIds={setPolygonIds}
			markerIds={markerIds}
			setMarkerIds={setMarkerIds}
		/>
		</>
	);
}

export default Map;
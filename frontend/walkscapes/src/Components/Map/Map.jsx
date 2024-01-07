// Map.jsx

import React, { useEffect, useRef, useState, useCallback } from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import AddMarkerButton from '../AddMarkerButton/AddMarkerButton';
import Markers from '../Challenges/Markers.jsx'

import * as Database from '../Challenges/GetDataFromDB.js'
import * as Fade from '../FadeModal/FadeModal.jsx';

// import { mapRef, DEFAULT_ICON } from '../../App.jsx';
import { DEFAULT_ICON, RED_ICON } from '../../App.jsx';
import Polygons from '../Challenges/Polygons.jsx';
import Challenges from '../Challenges/Challenges.jsx';


export const ADD_MARKER_MODAL_ID = 'AddMarkerModal';
export const CHOOSE_LOCATION_MESSAGE_ID = 'ChooseLocationMessage';
export const ADD_TO_CURR_LOCATION_MESSAGE_ID = 'AddToCurrLocationMessage';

// export let canAddNewMarker = true;



var polygonCoordinates = [
	[54.905, 23.975],   // Move to the right and slightly up
	[54.895, 23.975],   // Move to the right and slightly up
	[54.885, 23.955],   // Move to the right and slightly down
	[54.905, 23.955]    // Move to the right and slightly down
];

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
  
	console.log('clicked');

	return addTableIsOnTheMap;
}

const Map = ({mapContainer, mapRef}) => {
	// var markerIds = [];
	const [markerIds, setMarkerIds] = useState([]);
	const { canAddNewMarker, setCanAddNewMarker } = useMarkerState();




	// useEffect(() => {
	// 	console.log('0000000000000000000000000000');
	// 	setMarkerIds((prevMarkerIds) => [...prevMarkerIds, 6]);

	// 	// console.log(markerIds);
	//   }, []); // Add dependencies if needed

	useEffect(() => {
		console.log(markerIds);
	}, [markerIds]);
	// Memoize the functions using useCallback
	// const memoizedCanAddNewMarker = useCallback(() => canAddNewMarker, [canAddNewMarker]);
	// const memoizedSetCanAddNewMarker = useCallback((value) => setCanAddNewMarker(value), [setCanAddNewMarker]);
	
	const santaka = [54.89984180616253, 23.961551736420333];
    // mapRef.current - main map


  	useEffect(() => {
		initializeMap(mapContainer, santaka, mapRef);
		if (mapRef.current) {
			var polygon = L.polygon(polygonCoordinates, {color: 'red'}).addTo(mapRef.current);
			var marker = L.marker([54.899, 23.96155], { icon: DEFAULT_ICON }).addTo(mapRef.current);
		
			
		} else {
			console.log("Map not properly initialized");
		}    
  	}, []);

	//   useEffect(() => {
	// 	console.log("iiiiiiiiiiii ", canAddNewMarker);
	// }, [canAddNewMarker]);

	// useEffect(() => {
	// 	var r = Database.fetchRecordsForMarker(8);
	// 	console.log('8th marker: ');
	// 	console.log(r);

	// 	Database.fetchMarkers();
	// })

	
	

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

		{/* <Challenges /> */}
		<Polygons />
		{/* Putting marker of activated challenge on the map */}
		<Markers 
			mapRef={mapRef}
			polygonVerticles={polygonCoordinates}
			markersIds={markerIds}
			setMarkerIds={setMarkerIds}
		/>
		</>
	);
}

export default Map;
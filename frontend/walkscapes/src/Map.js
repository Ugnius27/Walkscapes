// import React, { useEffect, useRef, useState } from 'react';
// import ReactDOM from 'react-dom';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// import * as App from './App.jsx';

import { DEFAULT_ICON, RED_ICON } from './App';

import addMarkerImage from './add.png'; // Update the path accordingly



  
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
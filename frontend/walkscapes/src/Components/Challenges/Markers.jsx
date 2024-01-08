import React, { useEffect, useRef, useState, useCallback } from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import * as Database from './GetDataFromDB.js'

import { DEFAULT_ICON, RED_ICON } from '../../App.jsx';

const VIEW_SUGGESTIONS_BUTTON_ID = 'viewSuggestionsButton';

export function createMarker(mapRef, lat, lng) {
	var marker = L.marker([lat, lng], { icon: DEFAULT_ICON, draggable: false }).addTo(mapRef.current);
	bindFixedMarkersPopup(marker, lat, lng, mapRef);

	return marker._leaflet_id
}

function FixedMarkersPopup(markerId, lat, lng) {
	return (
		`<div style="text-align: center;">
			Coordinates: (${lat.toFixed(5)}, ${lng.toFixed(5)})
		</div>
		<div style="text-align: center">
			<button 
				id="${VIEW_SUGGESTIONS_BUTTON_ID}"
				onclick="viewSuggestions('${markerId}')"  
				class="popup-button"
			> 
				View suggestions
			</button>

			<button 
				onclick="fixMarkersPlace('${markerId}', '0')"  
				class="popup-button"
			> 
				Add new suggestion
			</button>
		</div>
		`
	)
}

export function bindFixedMarkersPopup(marker, lat, lng){
	// marker.bindPopup(`Coordinates: (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
	marker.bindPopup(FixedMarkersPopup(marker._leaflet_id, lat, lng));
}

export function isMarkerInThePolygon(markerCoords, polygonVerticles) {
	var x = markerCoords[0], y = markerCoords[1];
	var inside = false;

	for (var i = 0, j = polygonVerticles.length - 1; i < polygonVerticles.length; j = i++) {
		var xi = polygonVerticles[i][0], yi = polygonVerticles[i][1];
		var xj = polygonVerticles[j][0], yj = polygonVerticles[j][1];

		var intersect = ((yi > y) != (yj > y)) &&
			(x < ((xj - xi) * (y - yi) / (yj - yi) + xi));

		if (intersect) inside = !inside;
	}

	return inside;
}

export function isMarkerAtLeastInOnePolygon(markerCoords, polygons){
	for (var i = 0; i < polygons.length; i++){
		// console.log('m ', markerCoords);
		if (isMarkerInThePolygon(markerCoords, polygons[i].vertices))
			return true;
	}

	return false;
}

function doesCoordsMatch(coordsArray, targetCoords){
	for (var i = 0; i < coordsArray.length; i++){
		if (coordsArray[i] === targetCoords)
			return true;
	}

	return false;
}

const Markers = ({mapRef, markersData, setMarkersData, markersIds, setMarkerIds, activePolygons, challengesData, 
isNewSuggestionAdded, setIsNewSuggestionAdded}) => {
	// const [markersData, setMarkersData] = useState(null);
	const [challenges, setChallenges] = useState([]);

	function removeMarkersFromMap(markersIds) {
		for (let i = 0; i < markersIds.length; i++){
			var marker = mapRef.current._layers[markersIds[i]];
			mapRef.current.removeLayer(marker);
		}
	}

	function putMarkersOnMap(markersData, polygons) {
		var ids = []
		var usedCoords = [];

		if (!markersData || !polygons)
			return;

		for (var i = 0; i < markersData.length; i++){
			var coords = [markersData[i].latitude, markersData[i].longitude]

			for (var j = 0; j < polygons.length; j++){
				if (isMarkerInThePolygon(coords, polygons[j].vertices) && !doesCoordsMatch(usedCoords, coords)){
					// console.log(coords);
					ids.push(createMarker(mapRef, coords[0], coords[1]))
					usedCoords.push(coords);

					break
				}
			}
		}

		setMarkerIds((prevMarkerIds) => [...prevMarkerIds, ...ids]);
	}

	useEffect(() => {
		Database.fetchMarkers().then(markersInJson => {
			// console.log('a');
			setMarkersData(markersInJson);
		});

		console.log('markersDataUpdated');

	}, [challengesData, isNewSuggestionAdded])

	useEffect(() => {
		// console.log('markersData changed ', markersData);
		removeMarkersFromMap(markersIds)
		putMarkersOnMap(markersData, activePolygons);

		console.log('new markers put on map');
	}, [markersData, isNewSuggestionAdded])

	// useEffect(() => {
	// 	// console.log('markers data');
	// 	// console.log(markersData);

	// 	if (markersData && markersData.length > 0){
	// 		// console.log('0000000000');
	// 		// console.log(markersData[0])

			
		
	// 		// console.log(activePolygon.vertices[0]);
	// 		// TODO: delete all before adding new ones again
	// 		// putMarkersOnMap(markersData, activePolygon.vertices[0])
	// 		// // putMarkersOnMap(markersData, polygonVerticles)
	// 	}

	// }, [markersData])
}

export default Markers;
import React, { useEffect, useRef, useState, useCallback } from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import './Markers.css'
import * as Database from './GetDataFromDB.js'

import { DEFAULT_ICON, RED_ICON } from '../../App.jsx';

const VIEW_SUGGESTIONS_BUTTON_ID = 'viewSuggestionsButton';

export function createMarker(mapRef, lat, lng) {
	// console.log('mapref: ', mapRef);
	if (mapRef.current === null) return;

	// console.log('mapref!: ', mapRef);
	var marker = L.marker([lat, lng], { icon: DEFAULT_ICON, draggable: false }).addTo(mapRef.current);
	//var marker = L.marker([lat, lng]).addTo(mapRef.current);
	//var marker = leaflet_marker;
	//marker._icon.classList.add("red");
	//console.log('ll ', [lat, lng])
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
		if (coordsArray[i][0] == targetCoords[0] &&
			coordsArray[i][1] == targetCoords[1]) {
			return true;
		}
	}

	return false;
}

export function markerIdWithSameCoords(markersList, coordsToMatch) {
	for (let i = 0; i < markersList.length; i++){
		// console.log('markersList[i].id: ', markersList[i].id, 'c: ', [markersList[i].latitude, markersList[i].longitude],  ' and ', 
		// coordsToMatch);
		if (markersList[i].latitude == coordsToMatch[0] && markersList[i].longitude == coordsToMatch[1]){
			// console.log('markersList[i].id!!!!: ', markersList[i].id);
			return markersList[i].id;
		}
	}

	return null;
}

const Markers = ({mapRef, markersData, setMarkersData, markersIds, setMarkerIds, activePolygons, challengesData, 
isNewSuggestionAdded, setIsNewSuggestionAdded}) => {
	// const [markersData, setMarkersData] = useState(null);
	const [challenges, setChallenges] = useState([]);

	function removeMarkersFromMap(markersIds) {
		if (mapRef.current === undefined || mapRef.current === null){
			return;
		}
		// console.log('in removeMarkersFromMap: ', mapRef, ' markersIds: ', markersIds);


		for (let i = 0; i < markersIds.length; i++){
			var marker = mapRef.current._layers[markersIds[i]];
			mapRef.current.removeLayer(marker);
		}
	}

	function putMarkersOnMap(markersData, polygons) {
		var ids = []
		var usedCoords = [];

		if (!markersData || !polygons || !mapRef)
			return;

		console.log('putMarkersOnMap markersData: ', markersData);
		for (var i = 0; i < markersData.length; i++) {
			var coords = [markersData[i].latitude, markersData[i].longitude]

			var id = createMarker(mapRef, coords[0], coords[1])
			if (id) {
				ids.push(id)
				if (markersData[i].id == 37){
					var m = mapRef.current._layers[id];
					m.setIcon(RED_ICON);
					console.log('hhhhhhhhhhhhhhhhhh');
				}
			}

			
		}

		// for (var i = 0; i < markersData.length; i++){
		// 	var coords = [markersData[i].latitude, markersData[i].longitude]

		// 	for (var j = 0; j < polygons.length; j++){
		// 		if (isMarkerInThePolygon(coords, polygons[j].vertices) && !doesCoordsMatch(usedCoords, coords)){
		// 			// console.log(coords);
		// 			// console.log(doesCoordsMatch(usedCoords, coords), ' ', usedCoords, coords);
		// 			var id = createMarker(mapRef, coords[0], coords[1])
		// 			if (id){
		// 				ids.push(id)
		// 			}
					
		// 			usedCoords.push(coords);

		// 			break
		// 		}
		// 	}
		// }

		// console.log(usedCoords);
		// console.log(ids.length, ' llll');

		// setMarkerIds((prevMarkerIds) => [...prevMarkerIds, ...ids]);
		setMarkerIds(ids);
	}

	useEffect(() => {
		Database.fetchMarkers().then(markersInJson => {
			// console.log('a');
			setMarkersData(markersInJson);
		});

		// console.log('markersDataUpdated', markersData);

	}, [challengesData, isNewSuggestionAdded])

	useEffect(() => {
		// console.log('markersData changed ', markersData);
		removeMarkersFromMap(markersIds)
		// putMarkersOnMap(markersData, activePolygons);
		var polygons = []
		for (let i = 0; i < challengesData.length; i++){
			polygons.push(challengesData[i].polygon)
		}
		// putMarkersOnMap(markersData, challengesData.map(challenge => challenge.polygon));
		putMarkersOnMap(markersData, polygons);


		// console.log('new markers put on map');
	}, [markersData, isNewSuggestionAdded])

	useEffect(() => {
		console.log('markers ids: ', markersIds);
	}, [markersIds])

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
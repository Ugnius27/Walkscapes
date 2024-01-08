import React, { useEffect, useRef, useState, useCallback } from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import * as Database from './GetDataFromDB.js'

import { DEFAULT_ICON, RED_ICON } from '../../App.jsx';

export function createMarker(mapRef, lat, lng) {
	var marker = L.marker([lat, lng], { icon: DEFAULT_ICON, draggable: false }).addTo(mapRef.current);
	bindFixedMarkersPopup(marker, lat, lng, mapRef);

	return marker._leaflet_id
}

export function FixedMarkersPopup(markerId, lat, lng) {
	return (
		`<div style="text-align: center;">
			Coordinates: (${lat.toFixed(5)}, ${lng.toFixed(5)})
		</div>
		<div style="text-align: center">
			<button 
				class="popup-button"
			> 
				View suggestions
			</button>

			<button 
				onclick="fixMarkersPlace('${markerId}')"  
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

const Markers = ({mapRef, markersIds, setMarkerIds, activePolygons, challengesData}) => {
	const [markersData, setMarkersData] = useState(null);
	const [challenges, setChallenges] = useState([]);

	function putMarkersOnMap(markersData, polygons) {
		var ids = []

		if (!markersData || !polygons)
			return;

		for (var i = 0; i < markersData.length; i++){
			var coords = [markersData[i].latitude, markersData[i].longitude]

			for (var j = 0; j < polygons.length; j++){
				if (isMarkerInThePolygon(coords, polygons[j].vertices)){
					// console.log(coords);
					ids.push(createMarker(mapRef, coords[0], coords[1]))

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
	}, [challengesData])

	useEffect(() => {
		// console.log('markersData changed ', markersData);
		putMarkersOnMap(markersData, activePolygons);
	}, [markersData])

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
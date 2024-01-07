import React, { useEffect, useRef, useState, useCallback } from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import * as Database from './GetDataFromDB.js'

import { DEFAULT_ICON, RED_ICON } from '../../App.jsx';


export function FixedMarkersPopup(markerId, lat, lng) {
	return (
		`<div>
			Coordinates: (${lat.toFixed(5)}, ${lng.toFixed(5)})
		</div>
		<div style="text-align: center">
			<button class='popup-button'> 
				View suggestions
			</button>

			<button class='popup-button'> 
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


const Markers = ({mapRef, markersIds, setMarkerIds, polygonVerticles}) => {
	const [markersData, setMarkersData] = useState(null);










	const [challenges, setChallenges] = useState([]);

	useEffect(() => {
	  const fetchChallenges = async () => {
		try {
		  const response = await fetch('/api/challenges'); // Replace with your actual API endpoint
		  if (!response.ok) {
			throw new Error('Failed to fetch challenges');
		  }
  
		  const data = await response.json();
		  setChallenges(data);
		} catch (error) {
		  console.error(error);
		}
	  };
  
	  fetchChallenges();
	}, []); // Empty dependency array to run the effect once on mount










	function isMarkerInThePolygon(markerCoords, polygonVerticles) {
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

	function putMarkersOnMap(markersData, polygonVerticles) {
		var ids = []

		for (var i = 0; i < markersData.length; i++){
			var coords = [markersData[i].latitude, markersData[i].longitude]

			if (!isMarkerInThePolygon(coords, polygonVerticles)){
				// console.log('not', coords);
				continue;
			}
				

			var newMarker = L.marker(coords, { icon: DEFAULT_ICON, draggable: false }).addTo(mapRef.current);
			bindFixedMarkersPopup(newMarker, coords[0], coords[1]);

			// console.log('p: ', markersIds);
			// setMarkerIds((prevMarkerIds) => [...prevMarkerIds, newMarker._leaflet_id]);
			ids.push(newMarker._leaflet_id)
			console.log('added ', newMarker._leaflet_id, ' coords: ', coords);
		}

		setMarkerIds((prevMarkerIds) => [...prevMarkerIds, ...ids]);
	}


	useEffect(() => {
		// var r = Database.fetchRecordsForMarker(8);
		// console.log('8th marker: ');
		// console.log(r);

		// Database.fetchMarkers();
		// setMarkersData(Database.fetchMarkers());



		Database.fetchMarkers().then(markersInJson => {
			setMarkersData(markersInJson);
		}); 

	}, [])

	useEffect(() => {
		console.log('markers data');
		console.log(markersData);

		if (markersData && markersData.length > 0){
			console.log('0000000000');
			console.log(markersData[0])
		
			// TODO: delete all before adding new ones again
			putMarkersOnMap(markersData, polygonVerticles)
		}

	}, [markersData])
}

export default Markers
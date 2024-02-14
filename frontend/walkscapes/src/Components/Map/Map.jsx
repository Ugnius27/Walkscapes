// Map.jsx

import React, { useEffect, useState } from 'react';

import L from 'leaflet';
//import 'leaflet/dist/leaflet.css';

import '../Challenges/Markers.css'
import AddMarkerButton from '../AddMarkerButton/AddMarkerButton';

import * as Fade from '../FadeModal/FadeModal.jsx';
import * as Markers from '../Challenges/Markers.jsx'
import * as SuggestionsList from '../SuggestionsModal/SuggestionsListModal.jsx'
import * as ChallengesFunctions from '../Challenges/Challenges.jsx'
import * as CurrentLocation from '../../CurrentLocation.js'
import * as Calculations from '../../Calculations.js'

import { DEFAULT_ICON, RED_ICON } from '../../App.jsx';
import { BUTTON_TO_SHOW_UPLOAD_MODAL } from '../UploadModal/UploadModal.jsx';
import { BUTTON_TO_SHOW_SUGGESTIONS_MODAL } from '../SuggestionsModal/SuggestionsListModal.jsx';
import Challenges from '../Challenges/Challenges.jsx';
import SuggestionsListModal from '../SuggestionsModal/SuggestionsListModal.jsx';

export const ADD_MARKER_MODAL_ID = 'AddMarkerModal';
export const CHOOSE_LOCATION_MESSAGE_ID = 'ChooseLocationMessage';
export const ADD_TO_CURR_LOCATION_MESSAGE_ID = 'AddToCurrLocationMessage';

//const SPARE_CENTER_COORDINATE = [54.89984180616253, 23.961551736420333];
const SPARE_CENTER_COORDINATE = [54.53, 23.3];

export const useMarkerState = () => {
	const [canAddNewMarker, setCanAddNewMarker] = useState(true);
  
	return { canAddNewMarker, setCanAddNewMarker };
};

export function initializeMap(mapContainer, mapRef, polygonVertices) {
	if (!mapContainer.current || mapRef.current) return;

	const bounds = L.latLngBounds(polygonVertices);
	var map = L.map(mapContainer.current)
	const zoomLevel = map.getBoundsZoom(bounds);
	var centerCoords = bounds.getCenter()
	map.setView(centerCoords, zoomLevel);

	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	  maxZoom: 20,
	}).addTo(map);
  
	//var marker = L.marker(centerCoords, { icon: DEFAULT_ICON }).addTo(map);

	mapRef.current = map;
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


const Map = ({
	mapContainer, 
	mapRef, 
	challengesData, 
	setChallengesData, 
	setPressedChallengeNumber, 
	pressedChallengeNumber,
	markersRecords,
	setMarkersRecords,
	polygonIds,
	setPolygonIds}) => {
	// var markerIds = [];

	// The value of this variable is not important. The effects have to be activated when the value
	// of the variable changes
	// const [centerCoord, setCenterCoord] = useState([-1, -1]);
	const [isNewSuggestionAdded, setIsNewSuggestionAdded] = useState(true);

	// const [challengesData, setChallengesData] = useState(null);
	// const [polygonIds, setPolygonIds] = useState([]);
	const [activePolygons, setActivePolygons] = useState([]);


	const [recordsOfDisplayedMarker, setRecordsOfDisplayedMarker] = useState([]); 
	const [markersData, setMarkersData] = useState(null);
	const [markerIds, setMarkerIds] = useState([]);
	const { canAddNewMarker, setCanAddNewMarker } = useMarkerState();

	const [lastMarkerId, setLastMarkerId] = useState(-1);
	const [isMarkerExists, setIsMarkerExists] = useState(false);

	const santaka = [54.89984180616253, 23.961551736420333];

	function verticesOfClosestPolygon (challenges, currentLocationCoords) {
		var minDistance = null, minCoords, minVertices; //, index;
		var challengeIndex = null;

		for (let i = 0; i < challenges.length; i++){
			if (!challenges[i].is_active)
				continue;

			var pol_vertices = challenges[i].polygon.vertices;
			var centerOfPolygon = Calculations.getPolygonCenter(pol_vertices);
			
			// var centroid = polygon.getBounds().getCenter();
			// console.log('centroid ', centroid, ' centerOfPolygon ', centerOfPolygon);

			var distance = Calculations.distanceBetween2Points(centerOfPolygon, currentLocationCoords)
			// console.log('distance ', distance);
			// console.log('actp ', activePolygons);
			if (minDistance == null || distance < minDistance){
				//index = i;
				minDistance = distance;
				minCoords = centerOfPolygon;
				minVertices = pol_vertices

				challengeIndex = i;
			}
		}

		// console.log('minCoords: ', minCoords);
		// console.log('minVertices: ', minVertices);
		// return minCoords;
		setPressedChallengeNumber(challengeIndex);
		return minVertices
	}

  	useEffect(() => {

		if (challengesData.length > 0 && activePolygons.length > 0 && mapRef.current === null){
			// console.log('Chal data: ', challengesData)

			CurrentLocation.getCurrentLocation()
			.then(location => {
				// console.log("Current location:", location, ' activePolygons ', activePolygons);
				
				var vertices;
				vertices = verticesOfClosestPolygon(challengesData, location)
			
				initializeMap(mapContainer, mapRef, vertices);
				// }


				
			})
			.catch(error => {
				console.error("Error getting current location:", error);
				initializeMap(mapContainer, mapRef, challengesData[0].polygon.vertices);
				setPressedChallengeNumber(0);
			});

			// if ((centerCoord[0] === -1 || centerCoord[1] === -1)){
			// 	initializeMap(mapContainer, santaka, mapRef);

			// 	// console.log('ppppp');
			// }
		}
		
		// console.log('here again ', activePolygons);
			
	//else initializeMap(mapContainer, centerCoord, mapRef);
		// console.log('nelygu  ', centerCoord, ' ooo'); 
			 
		// console.log('initializeMap ', centerCoord, ' ppp'); 

		// console.log(polygonIds, challengesData);
  	}, [activePolygons]);

	// useEffect(() => {
	// 	console.log('Chal data: ', challengesData)
	// }, [challengesData])

	function markerIdFromLeafletId(markerLeafletId) {
		for (let i = 0; i < markerIds.length; i++) {
			if (markerLeafletId == markerIds[i]) {
				return markersData[i].id;
			}
		}

		return null;
	}

	window.viewSuggestions = function(markerLeafletId) {
		// console.log('pressed on view', markerId);

		var marker = mapRef.current._layers[markerLeafletId];
		var buttonToClick = document.getElementById(BUTTON_TO_SHOW_SUGGESTIONS_MODAL);
		
		if (!buttonToClick){
			console.log("Can't open suggestions list");
			return;
		}

			
		marker.setIcon(RED_ICON);
		marker.closePopup();
		buttonToClick.dataset.markerLeafletId = markerLeafletId;

		// var markersToDisplay = [];
		var recordsToDisplay = [];
		
		var markerId = Markers.markerIdWithSameCoords(markersData, [marker.getLatLng().lat, marker.getLatLng().lng]);
		
		// recordsToDisplay = SuggestionsList.markerRecords(markerId);
		// console.log('markersData: ', markersData, 'recordsToDisplay: ', recordsToDisplay, ' markerId: ', markerId);

		SuggestionsList.markerRecords(markerId).then(records => {
			// console.log('GETTING NEW RECORDS');
			recordsToDisplay = records;
			// console.log('last: ', markersToDisplay);
			// console.log('markersData: ', markersData, 'recordsToDisplay: ', recordsToDisplay, ' markerId: ', markerId);

			//setMarkers(markersToDisplay);
			setRecordsOfDisplayedMarker(recordsToDisplay)
			// console.log(markersToDisplay)

			buttonToClick.click();
		});
		// markersToDisplay = SuggestionsList.markerIdsWithSameCoords(markersData, marker.getLatLng().lat, marker.getLatLng().lng);
		// SuggestionsList.markersRecords(markersToDisplay).then(updatedMarkers => {
		// 	// console.log('GETTING NEW RECORDS');
		// 	markersToDisplay = updatedMarkers;
		// 	console.log('last: ', markersToDisplay);
		// 	setMarkers(markersToDisplay);
		// 	// console.log(markersToDisplay)

		// 	buttonToClick.click();
    	// });/////////////////////////////////




		
	}

	window.fixMarkersPlace = function(markerLeafletId, toggleFade) {
		setLastMarkerId(markerLeafletId);
		// var activePolygons=
		// 	challengesData?.filter(challenge => challenge.is_active)
		// 	.map(challenge => challenge.polygon) || [];
		var activePolygons = ChallengesFunctions.getActivePolygons(challengesData);
		

		// console.log("Fixing marker's place ", markerId, ' ', mapRef, activePolygons);
		
		
		var marker = mapRef.current._layers[markerLeafletId];
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
	
		if (toggleFade === '1')
			Fade.hideFade(CHOOSE_LOCATION_MESSAGE_ID, setCanAddNewMarker, mapRef, markerIds, setMarkerIds);

		marker.off('dblclick'); 
	
		var buttonToClick = document.getElementById(BUTTON_TO_SHOW_UPLOAD_MODAL);
	
		if (buttonToClick) {
			buttonToClick.click();			
	
			buttonToClick.dataset.lat = coordinates.lat;
			buttonToClick.dataset.lng = coordinates.lng;
			buttonToClick.dataset.markerLeafletId = marker._leaflet_id;
			// buttonToClick.dataset.markerId = markerIdFromLeafletId(marker._leaflet_id); //
		}
	}
	

	return (
		<>
		<div 
            className='m-3 border border-dark border-2'
            ref={mapContainer} 
            style={{ height: '80vh', zIndex: 1000 }} 
            id='map'
		>
        </div>

		<AddMarkerButton 
			mapRef={mapRef}
			markersData={markersData}
			polygonIds={polygonIds}
			setPolygonIds={setPolygonIds}
			activePolygons={
				// challengesData?.filter(challenge => challenge.is_active)
				// .map(challenge => challenge.polygon) || []
				ChallengesFunctions.getActivePolygons(challengesData)
			}
			markerIds={markerIds}
			setMarkerIds={setMarkerIds}
			lastMarkerId={lastMarkerId}
			setLastMarkerId={setLastMarkerId}

			isNewSuggestionAdded={isNewSuggestionAdded}
			setIsNewSuggestionAdded={setIsNewSuggestionAdded}
		/>

		<Fade.MessageOnFadeOverlay
			id = {CHOOSE_LOCATION_MESSAGE_ID}
			text = {`Click on the map to choose location`}
      		setCanAddNewMarker={setCanAddNewMarker}
			mapRef={mapRef}
			markerIds={markerIds}
			setMarkerIds={setMarkerIds}
		/>

		<SuggestionsListModal 
			mapRef={mapRef}
			markersData={markersData}
			// markers={markers}
			recordsOfDisplayedMarker={recordsOfDisplayedMarker}
			setRecordsOfDisplayedMarker={setRecordsOfDisplayedMarker}

			// suggestionsViewed={suggestionsViewed}
		/>

		<Challenges 
			mapRef={mapRef}
			// setCenterCoord={setCenterCoord}
			challengesData={challengesData}
			setChallengesData={setChallengesData}
			polygonIds={polygonIds}
			setPolygonIds={setPolygonIds}
			activePolygons={activePolygons}
			setActivePolygons={setActivePolygons}
			markersData={markersData}
			setMarkersData={setMarkersData}
			markerIds={markerIds}
			setMarkerIds={setMarkerIds}
			isNewSuggestionAdded={isNewSuggestionAdded}
			setIsNewSuggestionAdded={setIsNewSuggestionAdded}
		/>
		</>
	);
}

export default Map;
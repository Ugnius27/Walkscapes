// Map.jsx

import React, {useEffect, useState} from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import AddMarkerButton from '../AddMarkerButton/AddMarkerButton';

import * as Fade from '../FadeModal/FadeModal.jsx';
import * as Markers from '../Challenges/Markers.jsx'
import * as SuggestionsList from '../SuggestionsModal/SuggestionsListModal.jsx'
import * as ChallengesFunctions from '../Challenges/Challenges.jsx'

import {DEFAULT_ICON, RED_ICON} from '../../App.jsx';
import {BUTTON_TO_SHOW_UPLOAD_MODAL} from '../UploadModal/UploadModal.jsx';
import {BUTTON_TO_SHOW_SUGGESTIONS_MODAL} from '../SuggestionsModal/SuggestionsListModal.jsx';
import Challenges from '../Challenges/Challenges.jsx';
import SuggestionsListModal from '../SuggestionsModal/SuggestionsListModal.jsx';

export const ADD_MARKER_MODAL_ID = 'AddMarkerModal';
export const CHOOSE_LOCATION_MESSAGE_ID = 'ChooseLocationMessage';
export const ADD_TO_CURR_LOCATION_MESSAGE_ID = 'AddToCurrLocationMessage';

export const useMarkerState = () => {
    const [canAddNewMarker, setCanAddNewMarker] = useState(true);

    return {canAddNewMarker, setCanAddNewMarker};
};

export function initializeMap(mapContainer, center, mapRef) {
    if (!mapContainer.current || mapRef.current) return;

    var map = L.map(mapContainer.current).setView(center, 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 20,
    }).addTo(map);

    var marker = L.marker(center, {icon: DEFAULT_ICON}).addTo(map);
    marker.bindPopup("Center");

    mapRef.current = map; // Save the map instance to the ref
}

export function addButtonOnMap(customTableControl, map, addTableIsOnTheMap) {
    if (!addTableIsOnTheMap) {
        customTableControl.addTo(map);
        addTableIsOnTheMap = true;
    } else {
        map.removeControl(customTableControl);
        addTableIsOnTheMap = false;
    }

    // console.log('clicked');

    return addTableIsOnTheMap;
}


const Map = ({mapContainer, mapRef, challengesData, setChallengesData}) => {
    // var markerIds = [];

    // The value of this variable is not important. The effects have to be activated when the value
    // of the variable changes
    const [isNewSuggestionAdded, setIsNewSuggestionAdded] = useState(true);

    // const [challengesData, setChallengesData] = useState(null);
    const [polygonIds, setPolygonIds] = useState([]);

    const [markers, setMarkers] = useState([]);
    const [markersData, setMarkersData] = useState(null);
    const [markerIds, setMarkerIds] = useState([]);
    const {canAddNewMarker, setCanAddNewMarker} = useMarkerState();

    const [lastMarkerId, setLastMarkerId] = useState(-1);

    // const [suggestionsViewed, setSuggestionsViewed] = useState(false);


    // // // useEffect(() => {
    // // // 	console.log(markerIds);
    // // // }, [markerIds]);

    const santaka = [54.89984180616253, 23.961551736420333];
    // mapRef.current - main map


    useEffect(() => {
        initializeMap(mapContainer, santaka, mapRef);
    }, []);

    window.viewSuggestions = function (markerId) {
        console.log('pressed on view', markerId);

        var marker = mapRef.current._layers[markerId];
        var buttonToClick = document.getElementById(BUTTON_TO_SHOW_SUGGESTIONS_MODAL);

        if (!buttonToClick) {
            console.log("Can't open suggestions list");
            return;
        }


        marker.setIcon(RED_ICON);
        marker.closePopup();
        buttonToClick.dataset.markerid = markerId;

        var markersToDisplay = [];

        markersToDisplay = SuggestionsList.markerIdsWithSameCoords(markersData, marker.getLatLng().lat, marker.getLatLng().lng);
        SuggestionsList.markersRecords(markersToDisplay).then(updatedMarkers => {
            // console.log('GETTING NEW RECORDS');
            markersToDisplay = updatedMarkers;
            // console.log('last: ', markersToDisplay);
            setMarkers(markersToDisplay);
            console.log(markersToDisplay)


            // sleep(1000);
            // setSuggestionsViewed(true); // Set suggestionsViewed to true


            buttonToClick.click();
            // Continue with other code after markers are updated
            // marker.closePopup();
        });


    }

    window.fixMarkersPlace = function (markerId, toggleFade) {
        setLastMarkerId(markerId);
        // var activePolygons=
        // 	challengesData?.filter(challenges => challenges.is_active)
        // 	.map(challenges => challenges.polygon) || [];
        var activePolygons = ChallengesFunctions.getActivePolygons(challengesData);


        // console.log("Fixing marker's place ", markerId, ' ', mapRef, activePolygons);


        var marker = mapRef.current._layers[markerId];
        if (!marker) {
            console.log("Can't find marker to make in undragable");
            return;
        }

        var coordinates = marker.getLatLng();
        // console.log('f coord: ', coordinates);
        if (!Markers.isMarkerAtLeastInOnePolygon([coordinates.lat, coordinates.lng], activePolygons)) {
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
            buttonToClick.dataset.markerId = marker._leaflet_id;
        }
    }


    return (
        <>
            <div
                className='m-3 border border-dark border-2'
                ref={mapContainer}
                style={{height: '350px', zIndex: 1000}}
                id='map'
            >
            </div>

            <AddMarkerButton
                mapRef={mapRef}
                polygonIds={polygonIds}
                setPolygonIds={setPolygonIds}
                activePolygons={
                    // challengesData?.filter(challenges => challenges.is_active)
                    // .map(challenges => challenges.polygon) || []
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
                id={CHOOSE_LOCATION_MESSAGE_ID}
                text={`Click on the map to choose location`}
                setCanAddNewMarker={setCanAddNewMarker}
                mapRef={mapRef}
                markerIds={markerIds}
                setMarkerIds={setMarkerIds}
            />

            <SuggestionsListModal
                mapRef={mapRef}
                markersData={markersData}
                markers={markers}
                // suggestionsViewed={suggestionsViewed}
            />

            <Challenges
                mapRef={mapRef}
                challengesData={challengesData}
                setChallengesData={setChallengesData}
                polygonIds={polygonIds}
                setPolygonIds={setPolygonIds}
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
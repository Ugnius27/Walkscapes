import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import * as Challenges from './Challenges.js';
import * as Map from './Map.js';
import * as Calculations from './Calculations.js';

const MARKERS_API_ENDPOINT = '/api/record/markers';
const AMOUNT_OF_CLUSTERS = 0;
const RADIUS_OF_A_CLUSTER = 0.0050;

export const RED_ICON = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png'
});

export const DEFAULT_ICON = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});
////////////////
var polygonCoordinates = [
	[54.905, 23.975],   // Move to the right and slightly up
	[54.895, 23.975],   // Move to the right and slightly up
	[54.885, 23.955],   // Move to the right and slightly down
	[54.905, 23.955]    // Move to the right and slightly down
  ];
//////////////////////////  
// Save array to session storage
const saveArrayToSessionStorage = (key, array) => {
  try {
    const arrayAsString = JSON.stringify(array);
    sessionStorage.setItem(key, arrayAsString);
  } catch (error) {
    // Handle errors (e.g., storage quota exceeded)
    console.error('Error saving array to session storage:', error);
  }
};

// Retrieve array from session storage
const getArrayFromSessionStorage = (key) => {
  try {
    const arrayAsString = sessionStorage.getItem(key);
    if (arrayAsString) {
      return JSON.parse(arrayAsString);
    }
    return null; // Return null if the key is not found
  } catch (error) {
    // Handle errors
    console.error('Error retrieving array from session storage:', error);
    return null;
  }
};

function App() {
  const santaka = [54.89984180616253, 23.961551736420333];
  const mapContainer = useRef(null);
  const mapRef = useRef(null);       // mapRef.current - main map

  useEffect(() => {
    Map.initializeMap(mapContainer, santaka, mapRef);
    // var polygon = L.polygon(polygonCoordinates, {color: 'red'}).addTo(map);
    if (mapRef.current) {
      // var marker = L.marker([54.89984180616253, 23.96155], { icon: DEFAULT_ICON }).addTo(map);
      var polygon = L.polygon(polygonCoordinates, {color: 'red'}).addTo(mapRef.current);
      var marker = L.marker([54.899, 23.96155], { icon: DEFAULT_ICON }).addTo(mapRef.current);
  } else {
      console.error("Map not properly initialized");
  }

//   // Example usage
//   var marker = L.marker([54.895, 23.98], { icon: RED_ICON }).addTo(mapRef.current);
// var coordinateToCheck = [54.895, 23.98];  // Replace with the coordinate you want to check
// var isInside = Calculations.isCoordinateInsidePolygon(coordinateToCheck, polygonCoordinates);

// console.log(isInside);  // This will print true if the coordinate is inside the polygon, otherwise false


////////////
//sesion:

// Example usage
const myArray = [1, 2, 3, 4, 5];
const storageKey = 'myArrayKey';

// Save the array to session storage
saveArrayToSessionStorage(storageKey, myArray);

// Retrieve the array from session storage
const retrievedArray = getArrayFromSessionStorage(storageKey);

console.log(retrievedArray); // This will print the array retrieved from session storage

    
  }, []);





  return (
    <div className='App'>
      <Challenges.ContainerOfTogglerAndTitle />
      <div ref={mapContainer} style={{ height: '250px' }}></div>
    </div>
  );
}

export default App;
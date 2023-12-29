// App.jsx

import React, { useEffect, useRef, useState } from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import * as Challenges from './Challenges.js';
import * as Map from './Map.js';
import * as Calculations from './Calculations.js';
import * as Components from './ComponentsCreating.jsx';

import './popupsLeaflet.css'


import addMarkerImage from './add.png'; // Update the path accordingly

export const ADD_MARKER_MODAL_ID = 'AddMarkerModal';
export const CHOOSE_LOCATION_MESSAGE_ID = 'ChooseLocationMessage';
export const ADD_TO_CURR_LOCATION_MESSAGE_ID = 'AddToCurrLocationMessage';

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


var mapContainer;// = useRef(null);
export var mapRef;// = useRef(null);

function App() {
  mapContainer = useRef(null);
  mapRef = useRef(null);
///////
  // const addMarkerButtonRef = useRef(null);

  // const handleClick = () => {
  //   alert('Button clicked!');
  // };

//////////////////
  // const [username, setUsername] = useState("");
  // const [user, setUser] = useState("");
var user = true;
// var isOn = false;

  //////////////////
  const santaka = [54.89984180616253, 23.961551736420333];
         // mapRef.current - main map

  useEffect(() => {
    Map.initializeMap(mapContainer, santaka, mapRef);
    // var polygon = L.polygon(polygonCoordinates, {color: 'red'}).addTo(map);
    if (mapRef.current) {
      // var marker = L.marker([54.89984180616253, 23.96155], { icon: DEFAULT_ICON }).addTo(map);
      var polygon = L.polygon(polygonCoordinates, {color: 'red'}).addTo(mapRef.current);
      var marker = L.marker([54.899, 23.96155], { icon: DEFAULT_ICON }).addTo(mapRef.current);

    } else {
      console.log("Map not properly initialized");
  }
  // Components.InitializeMap2();

//   // Example usage
//   var marker = L.marker([54.895, 23.98], { icon: RED_ICON }).addTo(mapRef.current);
// var coordinateToCheck = [54.895, 23.98];  // Replace with the coordinate you want to check
// var isInside = Calculations.isCoordinateInsidePolygon(coordinateToCheck, polygonCoordinates);

// console.log(isInside);  // This will print true if the coordinate is inside the polygon, otherwise false


////////////
    
  }, [user]);


  // console.log(user);
  // console.log(Components.FadeModal);


  return (
    <div className='App'>
      {/* <p>smth</p> */}
      {/* {user? ( */}
        <>
          <Components.FadeModal/>
          
          <Challenges.ContainerOfTogglerAndTitle />
          <div 
            style={{ 
              position: 'relative', 
              height: '253px', 
              // border: 'solid', 
              marginLeft: '1.2rem'}}
          >
            <div 
              className='m-3 border border-dark border-2'
              ref={mapContainer} 
              style={{ height: '350px', zIndex: 1000 }} 
              id='map'>
            </div>
            <Components.MessageOnFadeOverlay
              id = {CHOOSE_LOCATION_MESSAGE_ID}
              text = {`Click on the map to choose location`}
            />
            {/* <div> */}
            <Components.AddMarkerTable/>
            {/* </div> */}
            
              {/* <div id="map" style="height: 400px;"></div> */}

          </div>
          {/* <p>logged in as {username}</p> */}
          {/* <button ref={addMarkerButtonRef} onClick={handleClick}>
            Click Me
          </button> */}
          {/* <CustomTable/> */}
        <div>
    </div>
        </>
      {/* ) : ( */}
        {/* <>
          <input type="text" placeholder='username' onChange={(e) => setUsername(e.target.value)}/>
          <button onClick={()=>setUser(username)}>Login</button>
        </> */}
        
      {/* )} */}
    </div>
  );
}

export default App;
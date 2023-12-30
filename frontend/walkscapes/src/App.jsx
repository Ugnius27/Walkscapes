// App.jsx

import React, { useEffect, useRef, useState } from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import './popupsLeaflet.css'
import * as Map from './Components/Map/Map.jsx';

import AppFirstRow from './Components/AppFirstRow/AppFirstRow.jsx';
import MapComponent from './Components/Map/Map.jsx';
import FadeModal from './Components/FadeModal/FadeModal.jsx';

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



//////////

var ChallengesData =
[
	{
		title: 'Challenge 1',
		description: 'Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the first item\'s accordion body.',
		Routes: ['Route 1', 'Route 2']
	},
	{
		title: 'Challenge 2',
		description: 'Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the first item\'s accordion body.',
		Routes: ['Route 3', 'Route 4']
	}
]



///////////

function App() {
  mapContainer = useRef(null);
  mapRef = useRef(null);

//////////////////
  // const [username, setUsername] = useState("");
  // const [user, setUser] = useState("");
/////////////////
var user = true;

  const santaka = [54.89984180616253, 23.961551736420333];
  // mapRef.current - main map

  useEffect(() => {
    Map.initializeMap(mapContainer, santaka, mapRef);
    if (mapRef.current) {
      var polygon = L.polygon(polygonCoordinates, {color: 'red'}).addTo(mapRef.current);
      var marker = L.marker([54.899, 23.96155], { icon: DEFAULT_ICON }).addTo(mapRef.current);

    } else {
      console.log("Map not properly initialized");
  }    
  }, [user]);


  return (
    <div className='App'>
      {/* <p>smth</p> */}
      {/* {user? ( */}
        <>
        {/* <OffCanvas Challenges={ChallengesData}/> */}
        <AppFirstRow Challenges={ChallengesData}/>
        
          {/* <Components.FadeModal/> */}
          <FadeModal/>
          
          <div 
            style={{ 
              position: 'relative', 
              height: '253px', 
              marginLeft: '1.2rem'}}
          >
            <MapComponent mapContainer={mapContainer}/>
           
            {/*
            <Components.MessageOnFadeOverlay
              id = {CHOOSE_LOCATION_MESSAGE_ID}
              text = {`Click on the map to choose location`}
            />
            <Components.AddMarkerTable/>*/}
            
          </div> 




          {/* <p>logged in as {username}</p> */}
          {/* <button ref={addMarkerButtonRef} onClick={handleClick}>
            Click Me
          </button> */}
          {/* <CustomTable/> */}




          
        {/* <div>
    </div> */}
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
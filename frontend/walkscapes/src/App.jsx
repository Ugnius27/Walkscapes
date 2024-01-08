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

export const RED_ICON = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png'
});

export const DEFAULT_ICON = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// // // var mapContainer;// = useRef(null);
// // // export var mapRef;// = useRef(null);


function App() {
  const [challengesData, setChallengesData] = useState([]);
  const [challengesToAccordion, setChallengesToAccordion] = useState([]);

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

  useEffect(() => {
    console.log('cha: ', challengesData, 'l: ', []);
    var Challenges = [];

    for (let i = 0; i < challengesData.length; i++){
      Challenges.push({
        title: challengesData[i].title,
        description: challengesData[i].description,
        Routes: []});
    }

    setChallengesToAccordion(Challenges);
    
  }, [challengesData])
  // var loggedIn = true;
// // //   mapContainer = useRef(null);
// // //   mapRef = useRef(null);

  var mapContainer = useRef(null);
  var mapRef = useRef(null);


  return (
    <div className='App'>
      {/* <p>smth</p> */}
      {/* {user? ( */}
        <>
        {/* <OffCanvas Challenges={ChallengesData}/> */}
        <AppFirstRow Challenges={challengesToAccordion}/>
        
          {/* <Components.FadeModal/> */}
          <FadeModal/>
          
          <div 
            style={{ 
              position: 'relative', 
              height: '253px', 
              marginLeft: '1.2rem'}}
          >
            <MapComponent 
              mapContainer={mapContainer}
              mapRef={mapRef}
              challengesData={challengesData}
              setChallengesData={setChallengesData}
            />
        
            {/*
            <Components.MessageOnFadeOverlay
              id = {CHOOSE_LOCATION_MESSAGE_ID}
              text = {`Click on the map to choose location`}
            />
            <Components.AddMarkerTable/>*/
            }
            
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
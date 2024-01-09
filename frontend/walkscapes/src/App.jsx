// App.jsx

import React, { useEffect, useRef, useState } from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import './popupsLeaflet.css'
import './Login.css'
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

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState("");

  const [challengesData, setChallengesData] = useState([]);
  const [challengesToAccordion, setChallengesToAccordion] = useState([]);


  useEffect(() => {
    var Challenges = [];

    for (let i = 0; i < challengesData.length; i++){
      Challenges.push({
        title: challengesData[i].title,
        description: challengesData[i].description,
        Routes: []});
    }

    setChallengesToAccordion(Challenges);
    
  }, [challengesData])

  useEffect (() =>{
    console.log(user);
  }, [user])
  // var loggedIn = true;
// // //   mapContainer = useRef(null);
// // //   mapRef = useRef(null);

  var mapContainer = useRef(null);
  var mapRef = useRef(null);

  return (
    <div className='App'>
      {user? (
        <>
        <AppFirstRow Challenges={challengesToAccordion}/>
        
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
          
        </div> 

        {/* <div>logged in as {username}</div> */}
        </>
        ) : (
        <>
          {/* <input type="text" placeholder='username' onChange={(e) => setUsername(e.target.value)}/>
          <button onClick={()=>setUser(username)}>Login</button> */}

        <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
          <div className="text-center input-box">
            <input
              className='form-control form-control-lg '
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
          />

          <button className='popup-button'
            onClick={() => setUser(username)}
          >
            Log in
          </button>            
            
          </div>
        </div>
        </> 
      )}

    </div>
  );
}

export default App;
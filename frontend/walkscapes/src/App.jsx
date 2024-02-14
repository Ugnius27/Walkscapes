// App.jsx

import React, { useEffect, useRef, useState } from 'react';

import L from 'leaflet';
//import 'leaflet/dist/leaflet.css';

import './popupsLeaflet.css'
import './Login.css'
import * as CurrentLocation from './CurrentLocation.js';
import * as Map from './Components/Map/Map.jsx';

import AppFirstRow from './Components/AppFirstRow/AppFirstRow.jsx';
import Carousel from './Components/AppFirstRow/Carousel.jsx'
import MapComponent from './Components/Map/Map.jsx';
import FadeModal from './Components/FadeModal/FadeModal.jsx';
import Description from './Components/Challenges/Description.jsx';

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
  const [challengesData, setChallengesData] = useState([]);
  const [challengesToAccordion, setChallengesToAccordion] = useState([]);
  const [pressedChallengeNumber, setPressedChallengeNumber] = useState(null);
  const [markersRecords, setMarkersRecords] = useState([]);
  const [polygonIds, setPolygonIds] = useState([]);

  useEffect(() => {
    var Challenges = [];

    for (let i = 0; i < challengesData.length; i++){
      Challenges.push({
        title: challengesData[i].title,
        description: challengesData[i].description,
        Routes: []});
    }

    setChallengesToAccordion(Challenges);

    //CurrentLocation.getCurrentLocation()
    
  }, [challengesData])

  var mapContainer = useRef(null);
  var mapRef = useRef(null);

  return (
    <div className='App p-3'>
      <>
      {/* <AppFirstRow Challenges={challengesToAccordion}/> */}
      <Carousel 
        challengesData={challengesData}
        mapRef={mapRef}
        pressedChallengeNumber={pressedChallengeNumber}
        setPressedChallengeNumber={setPressedChallengeNumber}
        polygonIds={polygonIds}
      />
      
      <FadeModal/>
      
      <div 
        style={{ 
          position: 'relative', 
          height: '253px', 
          marginLeft: '0.6rem'}}
      >
        <MapComponent 
          mapContainer={mapContainer}
          mapRef={mapRef}
          challengesData={challengesData}
          setChallengesData={setChallengesData}
          pressedChallengeNumber={pressedChallengeNumber}
          setPressedChallengeNumber={setPressedChallengeNumber}

          markersRecords={markersRecords}
          setMarkersRecords={setMarkersRecords}
          polygonIds={polygonIds}
          setPolygonIds={setPolygonIds}
        />
        {/* <Carousel /> */}
        <Description
          challengesData={challengesData}
          pressedChallengeNumber={pressedChallengeNumber}
        />
      </div> 

      

      </>

    </div>
  );
}

export default App;
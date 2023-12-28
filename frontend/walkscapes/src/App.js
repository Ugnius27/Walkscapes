import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import * as Challenges from './Challenges.js';
import * as Map from './Map.js';

const MARKERS_API_ENDPOINT = '/api/record/markers';
const AMOUNT_OF_CLUSTERS = 0;
const RADIUS_OF_A_CLUSTER = 0.0050;

const RED_ICON = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png'
});

export const DEFAULT_ICON = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function App() {
  const santaka = [54.89984180616253, 23.961551736420333];
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    Map.initializeMap(mapContainer, santaka, mapRef);
  }, []);

  return (
    <div className='App'>
      <Challenges.ContainerOfTogglerAndTitle />
      <div ref={mapContainer} style={{ height: '250px' }}></div>
    </div>
  );
}

export default App;
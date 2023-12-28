import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { DEFAULT_ICON } from './App';

export function initializeMap(mapContainer, center, mapRef) {
	if (!mapContainer.current || mapRef.current) return;
  
	var map = L.map(mapContainer.current).setView(center, 15);
	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	  maxZoom: 20,
	}).addTo(map);
  
	var marker = L.marker(center, { icon: DEFAULT_ICON }).addTo(map);
	marker.bindPopup("Center");
  
	mapRef.current = map; // Save the map instance to the ref
}
  
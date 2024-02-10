import L from 'leaflet';
//import 'leaflet/dist/leaflet.css';

import { useEffect, useState } from 'react'
import * as Database from './GetDataFromDB.js'

const Polygons = ({mapRef, polygonIds, setPolygonIds, activeChallenges, challenges, setChallengesData}) => {
	const [polygons, setPolygons] = useState(null);

	function createPolygon(map, vertices, color) {
		if (!map)
			return;

		var polygon = L.polygon(vertices, {color: color}).addTo(map);
		// console.log('pol id: ', polygon._leaflet_id);
		polygon.on('click', (e) => {
			console.log('clicked on polygon ', e,  '  id: ', e.target._leaflet_id);
		})
		//challenges[challengeNr].polygon['leaflet_id'] = polygon.options.id;
		// console.log(polygon)
		

		return polygon._leaflet_id;
	}

	function removePolygons(polygonIds) {
		if (mapRef.current === null)
			return;

		polygonIds.forEach(polygonId => {
			const polygon = mapRef.current._layers[polygonId];
			if (polygon) {
				mapRef.current.removeLayer(polygon);
		 	}
		});
	}
	  
	/*function putPolygonsOnMap(mapRef, activeChallenges) {
		var ids = []

		for (var i = 0; i < activeChallenges.length; i++) {
			ids.push(createPolygon(mapRef.current, activeChallenges[i].polygon.vertices, 'blue'));
		}

		setPolygonIds(ids);
	}*/

	function putPolygonsOnMap(mapRef, challenges) {
		var ids = [], tempChallenges = challenges

		for (var i = 0; i < challenges.length; i++) {
			ids.push(createPolygon(mapRef.current, challenges[i].polygon.vertices, 'blue'));
			tempChallenges[i].polygon['leaflet_id'] = ids[ids.length - 1]
		}

		setPolygonIds(ids);
		setChallengesData(tempChallenges)
		// console.log(tempChallenges)
	}

	useEffect(() => {
		Database.fetchPolygons().then(polygonsInJson => {
			setPolygons(polygonsInJson);
		})

	}, [])

	useEffect(() => {
		if (!polygons)
			return;

		removePolygons(polygonIds);
		putPolygonsOnMap(mapRef, challenges)
	}, [polygons, activeChallenges])
}

export default Polygons;
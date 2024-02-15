import L from 'leaflet';
//import 'leaflet/dist/leaflet.css';

import { useEffect, useState } from 'react'
import * as Database from './GetDataFromDB.js'

export const ACTIVE_POLYGON_COLOR = '#3DD730'
export const INACTIVE_POLYGON_COLOR = '#6CA6CD'
export const PRESSED_POLYGON_COLOR = '#1EF30C'

export function changeAllPolygonsColor(mapRef, challengesData, polygonIds) {
	for (let i = 0; i < polygonIds.length; i++){
		var polygon = mapRef.current._layers[polygonIds[i]];
		if (polygon){
			var color = challengesData[i].is_active? ACTIVE_POLYGON_COLOR : INACTIVE_POLYGON_COLOR;

			polygon.setStyle({ fillColor: color, color: color });
			console.log('created new polygon');
		}
			
	}
}

const Polygons = ({mapRef, polygonIds, setPolygonIds, activeChallenges, challenges, setChallengesData}) => {
	const [polygons, setPolygons] = useState(null);

	function createPolygon(map, vertices, color) {
		if (!map)
			return;

		var polygon = L.polygon(vertices, {color: color}).addTo(map);
		// console.log('pol id: ', polygon._leaflet_id);


		// polygon.on('click', (e) => {
		// 	console.log('clicked on polygon ', e,  '  id: ', e.target._leaflet_id);
		// })

		
		//challenges[challengeNr].polygon['leaflet_id'] = polygon.options.id;
		// console.log('id before return', polygon._leaflet_id)
		

		return polygon._leaflet_id;
	}

	function removePolygons(polygonIds) {
		if (mapRef.current === null)
			return;

		// console.log('polygonIds: ', polygonIds);
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


	// useEffect(() => {
	// 	console.log('polygonIds: ', polygonIds);
	// }, [polygonIds])

	function putPolygonsOnMap(mapRef, challenges) {
		var ids = [], tempChallenges = challenges

		for (var i = 0; i < challenges.length; i++) {
			var color = challenges[i].is_active? ACTIVE_POLYGON_COLOR : INACTIVE_POLYGON_COLOR;
			var id = createPolygon(mapRef.current, challenges[i].polygon.vertices, color)
			// console.log('id after: ', id);
			if (id >= 0){
				ids.push(id);
				tempChallenges[i].polygon['leaflet_id'] = ids[ids.length - 1]
			}
		}

		// console.log('ids: ', ids);
		setPolygonIds(ids);
		// console.log('polygonIds: ', polygonIds);
		setChallengesData(tempChallenges)
		// console.log(tempChallenges)
		//changeAllPolygonsColor(mapRef, challenges, polygonIds)

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
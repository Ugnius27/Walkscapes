import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useEffect, useState } from 'react'
import * as Database from './GetDataFromDB.js'

const Polygons = ({mapRef, polygonIds, setPolygonIds, activeChallenges}) => {
	const [polygons, setPolygons] = useState(null);
	// const [activePolygonVerticles, setActivePolygonVerticles] = useState(null);

	// function verticesOfPolygonById(id, polygons) {
	// 	return polygons?.find(polygon => polygon.id === id)?.vertices || null;
	// }

	function createPolygon(map, vertices, color) {
		var polygon = L.polygon(vertices, {color: color}).addTo(map);
		// console.log('pol id: ', polygon._leaflet_id);
		polygon.on('click', (e) => {
			console.log('clicked on polygon ', e,  '  id: ', e.target._leaflet_id);
		})

		return polygon._leaflet_id;
	}

	// function removePolygons(polygonIds) {
	// 	for (var i = 0; i < polygonIds.length; i++){
	// 		var polygon = mapRef.current._layers[polygonIds[i]];
	// 		console.log('pp: ', polygon);
	// 		mapRef.current.removeLayer(polygon)
	// 	}
	// }
	function removePolygons(polygonIds) {
		polygonIds.forEach(polygonId => {
			const polygon = mapRef.current._layers[polygonId];
			if (polygon) {
				mapRef.current.removeLayer(polygon);
		 	}
		});
	}
	  
	function putPolygonsOnMap(mapRef, activeChallenges) {
		var ids = []

		for (var i = 0; i < activeChallenges.length; i++) {
			ids.push(createPolygon(mapRef.current, activeChallenges[i].polygon.vertices, 'blue'));
		}

		setPolygonIds(ids);
	}

	useEffect(() => {
		Database.fetchPolygons().then(polygonsInJson => {
			setPolygons(polygonsInJson);
		})

		// setPolygons(() => Database.fetchPolygons().then());
	}, [])

	useEffect(() => {
		if (!polygons)
			return;

		// console.log('pols: ', polygons);
		// console.log('active challs: ', activeChallenges);
		removePolygons(polygonIds);
		putPolygonsOnMap(mapRef, activeChallenges)

	// 	if (activeChallenges)
	// 	console.log('actice chal: ', activeChallenges, '    its polygon: ', activeChallenges.polygon);
	// // TODO: delete unavailable polygons because now I only add
	// 	if (activeChallenges && activeChallenges.polygon && activeChallenges.polygon.vertices)
	// 	var polygon = L.polygon(activeChallenges.polygon.vertices, {color: 'blue'}).addTo(mapRef.current);

		// console.log('oooooooo  ', verticesOfPolygonById(activeChallenge.polygon_id, polygons));
		// setActivePolygonVerticles()
	}, [polygons, activeChallenges])




}

export default Polygons;
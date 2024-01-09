import { useEffect, useState } from 'react'
import * as Database from './GetDataFromDB.js'

import Polygons from './Polygons.jsx'
import Markers from './Markers.jsx'

export function getActivePolygons(challengesData){
	if (challengesData) {
		const activePolygonsTemp = [];
		for (let i = 0; i < challengesData.length; i++) {
			const challenge = challengesData[i];
			if (challenge.is_active) {
				activePolygonsTemp.push(challenge.polygon);
			}
		}
		var result = activePolygonsTemp;
		// console.log('polygons: ', result);
		return activePolygonsTemp;
		// Use the 'result' variable as needed.
	}
	return [];
}

const Challenges = ({mapRef, challengesData, setChallengesData, polygonIds, setPolygonIds, markersData, setMarkersData, 
markerIds, setMarkerIds, isNewSuggestionAdded, setIsNewSuggestionAdded}) => {
	const [activeChallenges, setActiveChallenges] = useState([]);
	const [activePolygons, setActivePolygons] = useState([]);

	useEffect(() => {
		Database.fetchChallenges().then((challengesInJson) => {
			setChallengesData(challengesInJson);
		}).catch((error) => {
			console.error('Error fetching challenges: ', error);
		});
	}, []);

	
	useEffect(() => {
		// // // setActiveChallenges(challengesData?.filter(challenge => challenge.is_active) || []);
		// var activeChallengesTemp = challengesData?.reduce((result, challenge) => {
		// 	if (challenge.is_active) {
		// 	  result.push(challenge);
		// 	}
		// 	return result;
		//   }, []) || [];

		var activeChallengesTemp = [];
		if (challengesData) {
			for (let i = 0; i < challengesData.length; i++) {
				const challenge = challengesData[i];
				if (challenge.is_active) {
				activeChallengesTemp.push(challenge);
				}
			}
		}
		  
		setActiveChallenges(activeChallengesTemp);


		// if (challengesData) {
		// 	const activePolygonsTemp = [];
		// 	for (let i = 0; i < challengesData.length; i++) {
		// 		const challenge = challengesData[i];
		// 		if (challenge.is_active) {
		// 			activePolygonsTemp.push(challenge.polygon);
		// 		}
		// 	}
		// 	var result = activePolygonsTemp;
		// 	console.log('polygons: ', result);
		// 	setActivePolygons(activePolygonsTemp);
		// 	// Use the 'result' variable as needed.
		// }

		setActivePolygons(getActivePolygons(challengesData))
		  
		  
	}, [challengesData])

	return (
		<>
		<Polygons 
			mapRef={mapRef}
			polygonIds={polygonIds}
			setPolygonIds={setPolygonIds}
			activeChallenges={activeChallenges}
		/>
		<Markers 
			mapRef={mapRef}
			challengesData={challengesData}
			activePolygons={
				// challengesData?.filter(challenge => challenge.is_active)
				// .map(challenge => challenge.polygon) || []
				activePolygons
			}
			markersData={markersData}
			setMarkersData={setMarkersData}
			markersIds={markerIds}
			setMarkerIds={setMarkerIds}
			isNewSuggestionAdded={isNewSuggestionAdded}
			setIsNewSuggestionAdded={setIsNewSuggestionAdded}
		/>
		</>
	);
}

export default Challenges
import { useEffect, useState } from 'react'
import * as Database from './GetDataFromDB.js'
import * as Calculations from '../../Calculations.js'
import * as CurrentLocation from '../../CurrentLocation.js'

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

const Challenges = ({mapRef, setCenterCoord, challengesData, setChallengesData, polygonIds, setPolygonIds, activePolygons,
	setActivePolygons,	 markersData, setMarkersData, 
markerIds, setMarkerIds, isNewSuggestionAdded, setIsNewSuggestionAdded}) => {
	const [activeChallenges, setActiveChallenges] = useState([]);
	// const [activePolygons, setActivePolygons] = useState([]);
	

	// function centerCoordinate (activePolygons, currentLocationCoords) {
	// 	var minDistance = null, minCoords; //, index;

	// 	for (let i = 0; i < activePolygons.length; i++){
	// 		var centerOfPolygon = Calculations.getPolygonCenter(activePolygons[i].vertices);

	// 		var distance = Calculations.distanceBetween2Points(centerOfPolygon, [currentLocationCoords.latitude, currentLocationCoords.longitude])
	// 		if (minDistance == null || distance < minDistance){
	// 			//index = i;
	// 			minDistance = distance;
	// 			minCoords = centerOfPolygon;
	// 		}
	// 	}

	// 	return minCoords;
	// }

	useEffect(() => {
		Database.fetchChallenges().then((challengesInJson) => {
			setChallengesData(challengesInJson);
			// console.log('challengesInJson: ', challengesInJson);
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
		// console.log('active challenges: ', activeChallengesTemp);


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
		// console.log('active ploygons: ', activePolygons);
		  
		  
	}, [challengesData])

	// useEffect(() => {
	// 	CurrentLocation.getCurrentLocation()
	// 	.then(location => {
	// 		console.log("Current location:", location);
	// 		setCenterCoord(centerCoordinate(activePolygons, location))
	// 	})
	// 	.catch(error => {
	// 		console.error("Error getting current location:", error);
	// 	});

		
	// }, [activePolygons])

	return (
		<>
		<Polygons 
			mapRef={mapRef}
			polygonIds={polygonIds}
			setPolygonIds={setPolygonIds}
			activeChallenges={activeChallenges}
			challenges={challengesData}
			setChallengesData={setChallengesData}
		/>
		<Markers 
			mapRef={mapRef}
			challengesData={challengesData}
			activePolygons={
				// challengesData?.filter(challenge => challenge.is_active)
				// .map(challenge => challenge.polygon) || []
				activePolygons
			}
			/*polygons={
				challengesData.map(challenge => challenge.polygon)
			}*/
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
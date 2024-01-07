import { useEffect, useState } from 'react'
import * as Database from './GetDataFromDB.js'

import Polygons from './Polygons.jsx'
import Markers from './Markers.jsx'
import { map } from 'jquery'

const Challenges = ({mapRef, challengesData, setChallengesData, polygonIds, setPolygonIds, markerIds, setMarkerIds}) => {
	const [activeChallenges, setActiveChallenges] = useState([]);
	// const [challengesData, setChallengesData] = useState(null);

	// // Finds id of active challenge. 
	// // Searches in an array of challenges passed in json
	// function idOfActiveChallenge(challenges) {
	// 	if (!challenges)
	// 		return null;

	// 	for (var i = 0; i < challenges.length; i++){
	// 		// console.log('ii', challenges[i]);
	// 		if (challenges[i].is_active){
	// 			// console.log('hhhhhhhhh');
	// 			return challenges[i].id;
	// 		}
	// 	}

	// 	return null;
	// }



	useEffect(() => {
		Database.fetchChallenges().then((challengesInJson) => {
			// console.log('challenges:', challengesInJson);
			setChallengesData(challengesInJson);
			// Now you can use the challenges array
		}).catch((error) => {
			console.error('Error fetching challenges: ', error);
		});
	}, []);

	
	useEffect(() => {
		// console.log('ch: ', challengesData);

		// console.log('pppp ', challengesData?.find(challenge => challenge.is_active) || null);
		setActiveChallenges(challengesData?.filter(challenge => challenge.is_active) || []);
		// setActiveChallengeId(idOfActiveChallenge(challengesData));

		
	}, [challengesData])

	// useEffect(() => {
	// 	// console.log('active chall id: ', activeChallengeId);
	// 	// if (challengesData && activeChallengeId == null){
	// 	// 	console.log('No active challenges');
	// 	// }
	// 	// if (activeChallenges.l)
	// 	// 	return;

	// 	// console.log(activeChallenges);


	// }, [activeChallenges])


	return (
		<>
		<Polygons 
			// activeChallenge={challengesData?.find(challenge => challenge.id === activeChallengeId) || null}
			mapRef={mapRef}
			polygonIds={polygonIds}
			setPolygonIds={setPolygonIds}
			activeChallenges={activeChallenges}
		/>
		<Markers 
			mapRef={mapRef}
			// activePolygons={activeChallenge && activeChallenge.polygon? activeChallenge.polygon : null}
			activePolygons={
				challengesData?.filter(challenge => challenge.is_active)
				.map(challenge => challenge.polygon) || []
			}
			markersIds={markerIds}
			setMarkerIds={setMarkerIds}
		/>
		</>
	);
}

export default Challenges
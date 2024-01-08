import { useEffect, useState } from 'react'
import * as Database from './GetDataFromDB.js'

import Polygons from './Polygons.jsx'
import Markers from './Markers.jsx'

const Challenges = ({mapRef, challengesData, setChallengesData, polygonIds, setPolygonIds, markerIds, setMarkerIds}) => {
	const [activeChallenges, setActiveChallenges] = useState([]);

	useEffect(() => {
		Database.fetchChallenges().then((challengesInJson) => {
			setChallengesData(challengesInJson);
		}).catch((error) => {
			console.error('Error fetching challenges: ', error);
		});
	}, []);

	
	useEffect(() => {
		setActiveChallenges(challengesData?.filter(challenge => challenge.is_active) || []);
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
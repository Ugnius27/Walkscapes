import { useEffect, useState } from 'react'
import * as Database from './GetDataFromDB.js'

const Challenges = ({mapRef}) => {
	const [activeChallengeId, setActiveChallengeId] = useState(null);
	const [challengesData, setChallengesData] = useState(null);

	// Finds id of active challenge. 
	// Searches in an array of challenges passed in json
	function idOfActiveChallenge(challenges) {
		if (!challenges)
			return null;

		for (var i = 0; i < challenges.length; i++){
			console.log('ii', challenges[i]);
			if (challenges[i].is_active){
				console.log('hhhhhhhhh');
				return challenges[i].id;
			}
		}

		return null;
	}

	useEffect(() => {
		Database.fetchChallenges().then((challengesInJson) => {
			console.log('challenges:', challengesInJson);
			setChallengesData(challengesInJson);
			// Now you can use the challenges array
		}).catch((error) => {
			console.error('Error fetching challenges: ', error);
		});
	}, []);

	
	useEffect(() => {
		console.log('ch: ', challengesData);

		setActiveChallengeId(idOfActiveChallenge(challengesData));

		
	}, [challengesData])

	useEffect(() => {
		console.log('active chall id: ', activeChallengeId);
	}, [activeChallengeId])
}

export default Challenges
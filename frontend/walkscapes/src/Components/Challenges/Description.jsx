import { useEffect } from "react"

const Description = ({challengesData, pressedChallengeNumber}) => {
	// useEffect (() => {
	// 	console.log('pressedChallengeNumber ', pressedChallengeNumber);
	// }, [pressedChallengeNumber])

	// useEffect (() => {
	// 	if (pressedChallengeNumber != null){
	// 		return (
	// 			<>
	// 				<h3>Description:</h3>
	// 				<p>{challengesData[pressedChallengeNumber].description}</p>
	// 			</>
	// 		)
	// 	}
	// }, [pressedChallengeNumber])
	// function allDescriptions(challengesData) {
	// 	var items = []

	// 	for (let i = 0; i < challengesData.length; i++){
	// 		items.push(
	// 			<>
	// 			<h3>Description:</h3>
	// 			<p>{challengesData[i].description}</p>
	// 			</>
	// 		)
	// 	}

	// 	return items
	// }

	return (
		<>
		{pressedChallengeNumber != null && challengesData.length > 0? 
			<>
				<h3>Description:</h3>
				<p>{challengesData[pressedChallengeNumber].description}</p>
			</> :
			<></>
		}
		</>
	)
}

export default Description
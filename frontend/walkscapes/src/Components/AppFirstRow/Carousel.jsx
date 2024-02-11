import { useEffect } from 'react';
import L from 'leaflet';

import './Carousel.css'

const Carousel = (({challengesData, mapRef, pressedChallengeNumber, setPressedChallengeNumber}) => {
	function carouselItems(challengesData){
		const items = [];
		for (let index = 0; index < challengesData.length; index++) {
			const challenge = challengesData[index];
			items.push(
				<div 
					key={index} 
					className={`carousel-item ${index === pressedChallengeNumber ? 'active' : ''}`}
					onClick={(event) => handleClickOnChallenge(event, challenge.title)}
				>
					<h3 className="text-center">{challenge.title}</h3>
				</div>
			);
		}
		// for (let index = 0; index < challengesData.length; index++) {
		// 	const challenge = challengesData[index];
		// 	items.push(
		// 		<div 
		// 			key={index} 
		// 			className={`carousel-item ${index === 0 ? 'active' : ''}`}
		// 			onClick={(event) => handleClickOnChallenge(event, challenge.title)}
		// 		>
		// 			<h3 className="text-center">{challenge.title}</h3>
		// 		</div>
		// 	);
		// }

		return items
	}
	

	function setViewOnPolygon(polygonVertices, map) {
		const bounds = L.latLngBounds(polygonVertices);
		const zoomLevel = map.getBoundsZoom(bounds);
		var centerCoords = bounds.getCenter()
		map.setView(centerCoords, zoomLevel);
	}

	function handleClickOnChallenge(event, challengeTitle) {
		// console.log('clicked on challenge');
		// Access event properties if needed
		// console.log('Event:', challengeTitle);

		for (let i = 0; i < challengesData.length; i++){
			if (challengeTitle === challengesData[i].title){
				setViewOnPolygon(challengesData[i].polygon.vertices, mapRef.current)
				setPressedChallengeNumber(i);
				// console.log('setPressedChallengeNumber ');
			}
		}
	}
	

	// useEffect(() => {
	// 	console.log(challengesData)
	// })

	return (
		<>
		<div id="carouselExampleIndicators" className="carousel slide">
		<div className="carousel-inner">
			{/* {challengesData.map((challenge, index) => (
				<div 
					key={index} 
					className={`carousel-item ${index === 0 ? 'active' : ''}`}
					onClick={(event, challengeTitle) => handleClickOnChallenge(event, challenge.title)}>
					<h3 className="text-center">{challenge.title}</h3>
				</div>
			))} */}
			{carouselItems(challengesData)}
		</div>

		<button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
			<span className="carousel-control-prev-icon" aria-hidden="true"></span>
			<span className="visually-hidden">Previous</span>
		</button>
		
		<button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
			<span className="carousel-control-next-icon" aria-hidden="true"></span>
			<span className="visually-hidden">Next</span>
		</button>

		{/* <div class="carousel-indicators">
			<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
			<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
			<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
		</div> */}
		</div>
		</>
	)
})

export default Carousel
import { useEffect } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import './Carousel.css'
import * as Polygons from '../Challenges/Polygons.jsx'

import {ACTIVE_POLYGON_COLOR, INACTIVE_POLYGON_COLOR, PRESSED_POLYGON_COLOR} from '../Challenges/Polygons.jsx'

const Carousel = (({challengesData, mapRef, pressedChallengeNumber, setPressedChallengeNumber, polygonIds}) => {
	// useEffect (() => {
	// 	console.log('polygonIds:: ', polygonIds);
	// }, [polygonIds])

	// function changeAllPolygonsColor(polygonIds) {
	// 	for (let i = 0; i < polygonIds.length; i++){
	// 		var polygon = mapRef.current._layers[polygonIds[i]];
	// 		if (polygon){
	// 			var color = challengesData[i].is_active? ACTIVE_POLYGON_COLOR : INACTIVE_POLYGON_COLOR;

	// 			polygon.setStyle({ fillColor: color, color: color });
	// 		}
				
	// 	}
	// }
	
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

			if (index === pressedChallengeNumber) {
				var polygon = mapRef.current._layers[polygonIds[index]];
				if (polygon)
					polygon.setStyle({ fillColor: 'blue', color: 'blue' });
			}
		}

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

	function handleNextChallenge() {
        const nextIndex = (pressedChallengeNumber + 1) % challengesData.length;
        handleClickOnChallenge(null, challengesData[nextIndex].title);
		setPressedChallengeNumber(nextIndex);

		// console.log(polygonIds);
		Polygons.changeAllPolygonsColor(mapRef, challengesData, polygonIds)
		var polygon = mapRef.current._layers[polygonIds[nextIndex]];
		console.log('polygon: ', polygon);
		if (polygon)
			polygon.setStyle({ fillColor: PRESSED_POLYGON_COLOR, color: PRESSED_POLYGON_COLOR });

    }

    function handlePrevChallenge() {
        const prevIndex = (pressedChallengeNumber - 1 + challengesData.length) % challengesData.length;
        handleClickOnChallenge(null, challengesData[prevIndex].title);
		setPressedChallengeNumber(prevIndex);

		Polygons.changeAllPolygonsColor(mapRef, challengesData, polygonIds)
		var polygon = mapRef.current._layers[polygonIds[prevIndex]];
		console.log('polygon: ', polygon);
		if (polygon)
			polygon.setStyle({ fillColor: PRESSED_POLYGON_COLOR, color: PRESSED_POLYGON_COLOR });
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

		<button 
			className="carousel-control-prev" 
			type="button" 
			data-bs-target="#carouselExampleIndicators" 
			data-bs-slide="prev"
			onClick={handlePrevChallenge}
		>
			<span className="carousel-control-prev-icon" aria-hidden="true"></span>
			<span className="visually-hidden">Previous</span>
		</button>
		
		<button 
			className="carousel-control-next" 
			type="button" 
			data-bs-target="#carouselExampleIndicators" 
			data-bs-slide="next"
			onClick={handleNextChallenge}
		>
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
import * as AddMarkerButton from '../AddMarkerButton/AddMarkerButton.jsx';
import { DEFAULT_ICON } from '../../App.jsx';
//import 'leaflet/dist/leaflet.css';


export function toggleFadeOverlay(){
	const fadeModalElement = document.getElementById('fadeModal');
	if (!fadeModalElement){
		console.log("Unable to hide fade overlay. Fade overlay is not found");
		return;
	}

	fadeModalElement.style.display = fadeModalElement.style.display == 'none' ? 'flex' : 'none';
}

export function toggleFadeMessage(messageId){
	const messageElement = document.getElementById(messageId);
	if (!messageElement){
		console.log("Can't toggle message because it is not found");
		return;
	}

	messageElement.style.display = messageElement.style.display == 'none' ? 'flex' : 'none';
}

export function hideFade(messageId, setCanAddNewMarker, mapRef, markerIds){

	toggleFadeOverlay();
	AddMarkerButton.toggleAddMarkerButton();
	toggleFadeMessage(messageId);

	mapRef.current.off('click');

	if (markerIds && markerIds.length > 0){
		var lastMarkerId = markerIds[markerIds.length - 1];
		var lastMarker = mapRef.current._layers[lastMarkerId];
		lastMarker.off('dblclick')
		lastMarker.setIcon(DEFAULT_ICON);
	}

}

export function MessageOnFadeOverlay({ id, text, setCanAddNewMarker, mapRef, markerIds, setMarkerIds }) { //TODO: fix mess text: (dbckick on marker to remove it)
	const mapElement = document.getElementById('map');
	var mapWidth, height;
	if (mapElement) {
		//const { w, h } = mapElement.getBoundingClientRect();
		const { width, height } = mapElement.getBoundingClientRect();

		// console.log('map width: ', width);
		mapWidth = width;
	}
	mapWidth = mapWidth - 3;
	
	return (
		<>
		<div 
			//className='mt-5 flex-column justify-content-center align-items-center'
			className="bg-white p-3 flex-column justify-content-center align-items-center"
			style={{
				position: 'absolute',
				top: '62vh',
				//left: '2.8vw',
				left: '50%',
				//transform: 'translate(-50%, -50%)', // Center the container itself
				transform: 'translateX(-50%)',
				width: mapWidth,
				zIndex: 1000,
				display: 'none',
      		}}
			//style={{zIndex: 985, display: 'none'}}
			id={id}
		>
			<div className='row'>
				<h4
					style={{zIndex: 985, color: '#55c95a'}}
				>
					{text}
				</h4>
			</div>
			<div 
				className='row' 
				style={{zIndex: 985}}
			>
				<button
					className='popup-button'
					onClick={async () => {
						hideFade(id, setCanAddNewMarker, mapRef, markerIds); 
						setCanAddNewMarker(currentState => {
							return false;
						});

						if (markerIds.length == 0)
							return;

						var marker = mapRef.current._layers[markerIds[markerIds.length - 1]];
						await mapRef.current.removeLayer(marker);
						setMarkerIds((prevMarkerIds) => prevMarkerIds.slice(0, -1));
						window.alert('The marker you placed has been removed.');
					}}
				>
					Go back
				</button>
			</div>
	
		</div>
		</>
	);
}

const FadeModal = () => {
	return (
    	<div
			className='modal-overlay'
			id='fadeModal'
			style={{
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			background: 'rgba(0, 0, 0, 0.5)',
			zIndex: 980,
			display: 'none'
        }}
      >
	  </div>
	);
}

export default FadeModal;
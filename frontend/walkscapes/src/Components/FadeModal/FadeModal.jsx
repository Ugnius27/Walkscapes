import * as AddMarkerButton from '../AddMarkerButton/AddMarkerButton.jsx';
import { useMarkerState } from '../Map/Map.jsx';

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

export function hideFade(messageId, setCanAddNewMarker, mapRef){

	toggleFadeOverlay();
	AddMarkerButton.toggleAddMarkerButton();
	toggleFadeMessage(messageId);

	// mapRef.current.off('click');
	// canAddNewMarker = true;
	// console.log(setCanAddNewMarker);
	// setCanAddNewMarker(currentState => !currentState);

	// // setCanAddNewMarker(currentState => {
	// // 	return true;
	// // });

	// mapRef.current.on('click', function (e) {});
	// console.log("HHHHHHHHH ");
	// console.log(setCanAddNewMarker);
}

// const HideFade = ({messageId, setCanAddNewMarker}) => {
// 	console.log("LLLLLL ");
// 	console.log(setCanAddNewMarker);
// }

export function MessageOnFadeOverlay({ id, text, setCanAddNewMarker }) { //TODO: fix mess text: (dbckick on marker to remove it)
	console.log("Message id (0): ", id);
	// console.log("RRRRRRRRRR");
	// console.log(setCanAddNewMarker);

	return (
		<>
		<div 
			className='mt-5 flex-column justify-content-center align-items-center'
			style={{zIndex: 985, display: 'none'}}
			// id='ChooseLocationMessage'
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
						hideFade(id, setCanAddNewMarker); 
						setCanAddNewMarker(currentState => {
							return false;
						});
					}}
					// onClick={() => HideFade({ id, setCanAddNewMarker })}
				>
					Go back
				</button>
			</div>

			{/* <div 
				className='row' 
				style={{zIndex: 985}}
			>
				<button
					className='popup-button'
					onClick={() => fixMarkersPlace()}
				>
					Fix marker's place
				</button>
			</div> */}
	
		</div>
		</>
	);
}

const FadeModal = () => {
	return (
    	<div
			className='modal-overlay'//{`modal-overlay${isFadeModalVisible ? ' visible' : ''}`}
			id='fadeModal'
			style={{
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			background: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha value for transparency
			zIndex: 980, // Ensure the overlay is above other content
			display: 'none'
        }}
      >
	  </div>
	);
}

export default FadeModal;
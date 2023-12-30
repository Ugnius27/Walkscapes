import * as AddMarkerButton from '../AddMarkerButton/AddMarkerButton.jsx';

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

export function hideFade(messageId){
	toggleFadeOverlay();
	AddMarkerButton.toggleAddMarkerButton();
	toggleFadeMessage(messageId);
}

export function MessageOnFadeOverlay({ id, text }) {
	console.log("Message id (0): ", id);

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

			{/* <div 
				className='row' 
				style={{zIndex: 985}}
			>
				<button
					className='popup-button'
					onClick={() => setFixMarkersPlace(true)}
				>
					Fix marker's place
				</button>
			</div> */}

			<div 
				className='row' 
				style={{zIndex: 985}}
			>
				<button
					className='popup-button'
					onClick={() => hideFade(id)}
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
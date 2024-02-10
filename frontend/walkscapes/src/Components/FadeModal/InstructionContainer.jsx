import {hideFade, } from './FadeModal.jsx'

const InstructionContainer = ({setCanAddNewMarker, setMarkerIds}) => {
	return (
    	<>
		{/* <div 
			className='mt-5 flex-column justify-content-center align-items-center'
			style={{zIndex: 985, display: 'none'}}
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
	
		</div> */}

		{/* <div
			id="map-container"
			className="bg-white p-3"
			style={{
				position: 'absolute',
				top: '65vh',
				left: '5vw',
				zIndex: 1000,
				display: 'flex',
      		}}
    	>
			<p>This is some text inside the container.</p>
			<button id="my-button">Click Me</button>
    	</div> */}


		</>
	);
}

export default InstructionContainer;
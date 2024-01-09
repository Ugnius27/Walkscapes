import '../OffCanvas/OffCanvas.css'
import './Accordion.css'

import * as SuggestionsListModal from './SuggestionsListModal.jsx'

const ImageDisplay = ({ blobData }) => {
	if (!blobData) {
	  return <p>No image available</p>;
	}
  
	const imageUrl = URL.createObjectURL(blobData);
  
	return (
	  <div className='m-3 d-flex justify-content-center align-items-center'
	  >
		<img src={imageUrl} alt="Image" style={{maxWidth: '100%', maxHeight: '20%'}} />
	  </div>
	);
  };

export const Photos = ({ photos }) => {
	// console.log('ph: ', ' ', photos);
  
	return (
		<>
		<h3 className='fs-5 mt-4 d-flex justify-content-center align-items-center' htmlFor="photos">
		  Photos
		</h3>
		{photos && photos.length > 0 && (
		  <div>
			{photos.map((photo, index) => (
				<ImageDisplay blobData={photo}/>
			))}
		  </div>
		)}
		</>	
	);
};

const AccordionItem = ({marker, index}) => {
	return (
		<>
		<div class="accordion-item custom-bg">
			<h2 class="accordion-header">
				<button 
					class="accordion-button collapsed acordion-in-offCanvas" 
					type="button" 
					data-bs-toggle="collapse" 
					data-bs-target={`#collapse${index}`} 
					aria-expanded="false" 
					aria-controls={`collapse${index}`}>
					{index + 1}
				</button>
			</h2>
			<div 
				id={`collapse${index}`}
				class="accordion-collapse collapse" 
				data-bs-parent="#suggestionsAccordion"
			>
				<div className="accordion-body acordion-in-offCanvas-item">						
					{marker.description != ""?
					<>
					<h3 className='fs-5 d-flex justify-content-center align-items-cente'>
						Description
					</h3>
					{marker.description}
					</> : <></>}
					
					{marker.photos.length > 0? 
					<Photos 
						photos={marker.photos}
					/> :
					<></>
					}
					
				</div>
			</div>
		</div>
		</>
	);
}

const Accordion = ({markers}) => {
	return (
		<>
		<div className="accordion accordion-flush" id="suggestionsAccordion">
			{markers.map((marker, index) => (
				<AccordionItem 
					marker={marker}
					index={index}
				/>
			))}
		</div>
		</>
	);
}

export default Accordion;
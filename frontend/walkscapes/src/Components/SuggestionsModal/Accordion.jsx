import '../OffCanvas/OffCanvas.css'
import './Accordion.css'
import * as Database from '../Challenges/GetDataFromDB.js'

import * as SuggestionsListModal from './SuggestionsListModal.jsx'
import { useEffect, useState } from 'react';

const ImageDisplay = ({ blobData }) => {
	console.log('--------------- ', blobData);
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

export const Photos = ({ photos, r }) => {
	const [imagesBlob, setImagesBlob] = useState([]);
	const [loading, setLoading] = useState(true);

	var I = []

	function blobPhotos(photos) {
		for (let i = 0; i < photos.length; i++){
			getBlobData(photos[i])
			console.log('bbb: ', imagesBlob);
			console.log(' I: ', I);
		}
	}

	useEffect(() => {
		async function fetchData() {
			if (!photos || photos.length <= 0) {
				console.log('nonono ', photos.length, '   r: ', r);
				setLoading(false); // Update loading state
			} else {
				console.log('y ', photos.length, '   r: ', r);
				const blobData = await Promise.all(photos.map(async photoId => {
					try {
						const image = await Database.fetchRecordImage(photoId);
						return image;
					} catch (error) {
						console.error('Error fetching image for marker', error);
						return null;
					}
				}));
				setImagesBlob(blobData);
				setLoading(false); // Update loading state
			}
		}
	
		fetchData();
	}, [photos, r]); // Add dependencies

	async function getBlobData(imageId){
		// console.log(' photos', photos.length);
		try {
			const image = await Database.fetchRecordImage(imageId);
			I.push(image)
			return image;
		} catch (imageError) {
			console.error('Error fetching image for marker', imageError);
		}

		return null;
	}
  
	return (
		<>
		<h3 className='fs-5 mt-4 d-flex justify-content-center align-items-center' htmlFor="photos">
		  Photos
		</h3>
		{(photos.length > 0)? 
		<> 
		   <div>
		 	{/* {imagesBlob.map((image, index) => (
		 		<ImageDisplay blobData={image}/>				
		 	))} */}
			{loading ? (
				<p>Loading images...</p>
			) : (
				<div>
					{imagesBlob.map((image, index) => (
						<ImageDisplay key={index} blobData={image} />
					))}
				</div>
			)}
		   </div>
		</>
		: <></>}

		
		</>	
	);
};

const AccordionItem = ({record, index}) => {
	return (
		<>
		<div className="accordion-item custom-bg">
			<h2 className="accordion-header">
				<button 
					className="accordion-button collapsed acordion-in-offCanvas" 
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
				className="accordion-collapse collapse" 
				data-bs-parent="#suggestionsAccordion"
			>
				<div className="accordion-body acordion-in-offCanvas-item">						
					{record.description != ""?
					<>
					<h3 className='fs-5 d-flex justify-content-center align-items-cente'>
						Description
					</h3>
					{record.description}
					</> : <></>}
					
					{
						record.image_ids? 
						<Photos 
							r={record}
							photos={record.image_ids}
						/> :
						<></>
					}
					
					
				</div>
			</div>
		</div>
		</>
	);
}

const Accordion = ({records}) => {
	return (
		<>
		<div className="accordion accordion-flush" id="suggestionsAccordion">
			{records.map((record, index) => (
				// <AccordionItem 
				// 	marker={marker}
				// 	index={index}
				// />
				<AccordionItem
					record={record}
					index={index}
				/>
			))}
		</div>
		</>
	);
}

export default Accordion;
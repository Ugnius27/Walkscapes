import React, { useEffect, useRef, useState, useCallback } from 'react';

import * as Database from '../Challenges/GetDataFromDB.js'

import { DEFAULT_ICON, RED_ICON } from '../../App.jsx';
import { marker } from 'leaflet';
import Accordion from './Accordion.jsx';

export const BUTTON_TO_SHOW_SUGGESTIONS_MODAL = 'suggestionsModalButton';
const SUGGESTIONS_MODAL = 'suggestionsModal';

// Function that finds markers ids (of database) that has the coordinates [lat, lng]
export function markerIdsWithSameCoords(markersData, lat, lng){
  // console.log(markersData);
  var markers = []

  // return markersData.filter()
  if (!markersData){
    return null;
  }

  for (var i = 0; i < markersData.length; i++){
    if (markersData[i].latitude === lat && markersData[i].longitude === lng){
      markers.push({
        id: markersData[i].id,
        description: "",
        photos: []
      });
    }
  }

  // console.log(markers)
  return markers;
}


export async function markersRecords(markers) {
  if (!markers)
    return null;

  for (let i = 0; i < markers.length; i++) {
    try {
      // Fetch record for the current marker
      const record = await Database.fetchRecordsForMarker(markers[i].id);
      
      // Update the marker with the fetched record
      markers[i].description = record.description;

      for (let j = 0; j < record.photos.length; j++){
        try {
          // Fetch image for the current photo
          const image = await Database.fetchRecordImage(markers[i].id, record.photos[j]);
          // console.log('Image for marker', i, 'photo', j, ':', image);
          
          // Update the marker with the fetched image data
          // markers[i].photos[j].image = image;
          markers[i].photos[j] = image;
        } catch (imageError) {
          console.error('Error fetching image for marker', i, 'photo', j, ':', imageError);
        }
      }
      
      // console.log('Record for marker', i, ':', record);
    } catch (error) {
      console.error('Error fetching record for marker', i, ':', error);
    }
  }

  return markers;
}



const SuggestionsListModal = ({mapRef, markersData, markers}) => {
  const handleClose = () => {
    var clickedButton = document.getElementById(BUTTON_TO_SHOW_SUGGESTIONS_MODAL);

    if (!clickedButton)
      return;

    const markerId = clickedButton.dataset.markerId;
    var marker = mapRef.current._layers[markerId];

    marker.setIcon(DEFAULT_ICON);
  };

  const HeaderOfModal = () => {
    return (
      <div class="modal-header">
        <h1 
          class="modal-title fs-4" 
          id={`${SUGGESTIONS_MODAL}Label`}
        >
          Suggestions
        </h1>
        <button style={{display: 'flex'}}
          type="button" 
          class="btn-close"
          data-bs-dismiss="modal" 
          aria-label="Close"
          onClick={handleClose}
        ></button>
      </div>
    );
  }


	return (
		<>
		<button 
      id={BUTTON_TO_SHOW_SUGGESTIONS_MODAL}
      data-markerId={-1} // markers id that was pressed
      type="button" 
      class="btn btn-primary" 
      data-bs-toggle="modal" 
      data-bs-target={`#${SUGGESTIONS_MODAL}`}
      style={{display: 'none'}}
    >
    </button>

    <div 
      class="modal fade" 
      id={SUGGESTIONS_MODAL} 
      data-bs-backdrop="static"
      data-bs-keyboard="false" 
      tabindex="-1" 
      aria-labelledby={`${SUGGESTIONS_MODAL}Label`}
      aria-hidden="true"
      data-bs-show={true}
      data-bs-dismiss='modalC'
    >
      <div class="modal-dialog">
        <div class="modal-content custom-bg">
          <HeaderOfModal />

          <Accordion 
            markers={markers}
          />

         
        </div>
      </div>
    </div>
		</>
	);
}

export default SuggestionsListModal;
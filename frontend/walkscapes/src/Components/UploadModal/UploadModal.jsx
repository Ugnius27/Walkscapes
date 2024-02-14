import L, { map } from 'leaflet';
//import 'leaflet/dist/leaflet.css';
import '../../popupsLeaflet.css'

import React, { useState, useEffect } from 'react';

import * as UploadToDB from '../UploadModal/UploadDataToDB.js'
import * as Markers from '../Challenges/Markers.jsx'

import { DEFAULT_ICON, RED_ICON } from '../../App.jsx';

export const UPLOAD_MODAL_ID = 'uploadModal';
export const BUTTON_TO_SHOW_UPLOAD_MODAL = 'showUploadModalButton';

const HeaderOfModal = () => {
  return (
    <div className="modal-header">
      <h1 
        className="modal-title fs-4" 
        id={`${UPLOAD_MODAL_ID}Label`}
      >
        Upload information about the place
      </h1>
      <button style={{display: 'flex'}}
        type="button" 
        className="btn-close"
        data-bs-dismiss="modal" 
        aria-label="Close"
      ></button>
    </div>
  );
}

const ImagesOfModal = ({handleDelete, handleImageChange, selectedImages}) => {
  return (
    <>
    <div className='modal-body'>
      <h3 
        className="fs-5" 
        htmlFor="images"
      >
        Choose image
      </h3>
      <label 
        className="popup-button" 
        htmlFor="images"
      >
        Choose Files
      </label>
      <input
        accept="image/*"
        id="images"
        multiple
        name="image"
        required
        style={{ display: 'none' }}
        type="file"
        onChange={handleImageChange}
      />

      <div className='mt-3'>
        <h3 className='fs-5'>Uploaded Images:</h3>
        <ul 
          className="list" 
          id="imageList"
        >

          {selectedImages.map((file, index) => (
            <li key={index}>
              {file.name}
              <button
                className="btn btn-link"
                onClick={() => handleDelete(index)}
              >&#10005;
              </button>
            </li>
          ))}
        </ul>
      </div>
      ...
    </div>
    </>
  );
}

const DescriptionOfModal = ({description, setDescription}) => {
  return (
    <div className='modal-body'>
      <h3 
        className='fs-5' 
        htmlFor="description"
      >
        Description:
      </h3>
      <textarea
        className='form-control'
        cols="60"
        id="description"
        name="description"
        // required='true'
        required={true}
        rows="4"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
    </div>
  );
}

const UploadModal = ({map, lastSubmittedMarkerId, isNewSuggestionAdded, setIsNewSuggestionAdded, markersData, markerIds}) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [description, setDescription] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  var buttonToShowUploadModal = document.getElementById(BUTTON_TO_SHOW_UPLOAD_MODAL);

  function markerIdFromLeafletId(markerLeafletId) {
    console.log('markersData: ', markersData);
    for (let i = 0; i < markerIds.length - 1; i++) {
      if (markerLeafletId == markerIds[i]) {
        console.log('pppppppppppp:m ', markersData[i], ' i: ', i);
        return markersData[i].id;
      }
    }
  
    return null;
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // console.log("Images:");
    // console.log(files);
  };

  const handleSubmit = () => {
    // console.log('Images:', selectedImages);
    // console.log('Description:', description);

    setSelectedImages([]);
    setDescription('');

    //console.log('submitted marker: ', lastSubmittedMarkerId);


    var lastSubmittedMarker = map._layers[lastSubmittedMarkerId];
    var coordinates = lastSubmittedMarker.getLatLng();
    console.log('before uploadRecordFunc');
    console.log('lastSubmittedMarker: ', lastSubmittedMarker);
    var markerId = markerIdFromLeafletId(lastSubmittedMarkerId);

    var isNewMarkerNeeded = true;
    for (let i = 0; i < markersData.length - 1; i++){ //maybe delete
      if (markersData[i].latititude == coordinates.lat && markersData[i].longtitute == coordinates.lng){
        isNewMarkerNeeded = false;
      }
    }
    if (markerId == null){
      isNewMarkerNeeded = false;
    }

    UploadToDB.uploadRecord(coordinates.lat, coordinates.lng, selectedImages, description, isNewMarkerNeeded, markerId)
        .then(() => {
            setIsNewSuggestionAdded((previous) => !previous);
            //console.log('SET SUGG ADDED');
            //console.log('lastSubmittedMarker: ', lastSubmittedMarker);

            //lastSubmittedMarker.setIcon(RED_ICON);
            //console.log('icon changed');
            //lastSubmittedMarker.openPopup();
            
            
            // Now you can fetch markers or perform any other actions 
            // that should happen after the record is successfully uploaded.
        })
        .catch(error => {
            // Handle error if the record upload fails
            console.error('Error uploading record:', error);
        });
        
    setShowAlert(true);
    
    /*UploadToDB.uploadRecord(coordinates.lat, coordinates.lng, selectedImages, description);

    setIsNewSuggestionAdded((previous) => !previous);

    // console.log(lastSubmittedMarker);
    lastSubmittedMarker.setIcon(DEFAULT_ICON);
    lastSubmittedMarker.openPopup();

    setShowAlert(true);*/
  };
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const showAlertWithDelay = async () => {
    await sleep(100);
    window.alert('The marker was successfully submitted!');
    setShowAlert(false);
  };

  useEffect(() => {
    if (showAlert) {
      showAlertWithDelay();
    }
  }, [showAlert]);

  const handleDelete = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  return (
    <>
    <button 
      id={BUTTON_TO_SHOW_UPLOAD_MODAL}
      data-lat={0}
      data-lng={0}
      type="button" 
      className="btn btn-primary" 
      data-bs-toggle="modal" 
      data-bs-target={`#${UPLOAD_MODAL_ID}`}
      style={{display: 'none'}}
    >
    </button>

    <div 
      className="modal fade" 
      id={UPLOAD_MODAL_ID} 
      data-bs-keyboard="false" 
      tabIndex="-1" 
      aria-labelledby={`${UPLOAD_MODAL_ID}Label`}
      aria-hidden="true"
      data-bs-show={true}
      data-bs-dismiss='modalC'
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <HeaderOfModal />

          <ImagesOfModal 
            handleDelete={handleDelete}
            handleImageChange={handleImageChange}
            selectedImages={selectedImages}
          />

          <hr></hr>

          <DescriptionOfModal 
            description={description}
            setDescription={setDescription}  
          />
          
          <div className="modal-footer">
            <button
              className="popup-button"
              data-bs-dismiss="modal"
              id="submit"
              onClick={handleSubmit} // TODO: po submit paspaudus kryziuka turi pasinaikinti markeris
              type="button"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default UploadModal;
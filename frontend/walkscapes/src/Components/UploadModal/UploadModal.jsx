import L, { map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../popupsLeaflet.css'

import React, { useState, useEffect } from 'react';
import { DEFAULT_ICON, RED_ICON } from '../../App.jsx';

export const UPLOAD_MODAL_ID = 'uploadModal';
export const BUTTON_TO_SHOW_UPLOAD_MODAL = 'showUploadModalButton';



const HeaderOfModal = () => {
  return (
    <div class="modal-header">
      <h1 
        class="modal-title fs-4" 
        id={`${UPLOAD_MODAL_ID}Label`}
      >
        Upload information about the place
      </h1>
      <button style={{display: 'flex'}}
        type="button" 
        class="btn-close"
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
        class="fs-5" 
        for="images"
      >
        Choose image
      </h3>
      <label 
        className="popup-button" 
        for="images"
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
        for="description"
      >
        Description:
      </h3>
      <textarea
        className='form-control'
        cols="60"
        id="description"
        name="description"
        required='true'
        rows="4"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
    </div>
  );
}

const UploadModal = ({map, lastSubmittedMarkerId}) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [description, setDescription] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  var buttonToShowUploadModal = document.getElementById(BUTTON_TO_SHOW_UPLOAD_MODAL);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    console.log("Images:");
    console.log(files);
  };

  const handleSubmit = () => {
    console.log('Images:', selectedImages);
    console.log('Description:', description);
    // Reset form fields
    setSelectedImages([]);
    setDescription('');

    console.log('submitted marker: ', lastSubmittedMarkerId);
    var lastSubmittedMarker = map._layers[lastSubmittedMarkerId];

    console.log(lastSubmittedMarker);
    lastSubmittedMarker.setIcon(DEFAULT_ICON);
    lastSubmittedMarker.openPopup();

    setShowAlert(true);
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

  useEffect(() => {
    console.log('BBBBBBBBBB');
    if (!buttonToShowUploadModal)
      return; 

    var markerId = parseInt(buttonToShowUploadModal.dataset.markerId);

    console.log(markerId);
    // }
  }, []);

const handleDelete = (index) => {
  const newImages = [...selectedImages];
  newImages.splice(index, 1);
  setSelectedImages(newImages);
};

function A (){
  console.log("AAAAAAAAAAA");
}

return (
  <>
  <button 
    id={BUTTON_TO_SHOW_UPLOAD_MODAL}
    data-lat={0}
    data-lng={0}
    type="button" 
    class="btn btn-primary" 
    data-bs-toggle="modal" 
    data-bs-target={`#${UPLOAD_MODAL_ID}`}
    style={{display: 'none'}}
  >
  </button>

  <div 
    class="modal fade" 
    id={UPLOAD_MODAL_ID} 
    // data-bs-backdrop="static" 
    data-bs-keyboard="false" 
    tabindex="-1" 
    aria-labelledby={`${UPLOAD_MODAL_ID}Label`}
    aria-hidden="true"
    data-bs-show={true}
    data-bs-dismiss='modalC'
    // role='dialog'
    // style={{display: 'flex'}}
  >
    <div class="modal-dialog">
      <div class="modal-content">
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
        
        <div class="modal-footer">
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
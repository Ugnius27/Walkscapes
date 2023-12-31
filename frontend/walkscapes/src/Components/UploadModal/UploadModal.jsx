import React, { useState } from 'react';
export const UPLOAD_MODAL_ID = 'uploadModal';

const UploadModal = ({lat, lng}) => {
	const [selectedImages, setSelectedImages] = useState([]);
  const [description, setDescription] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    console.log("Images:");
  console.log(files);
  };

  const handleSubmit = () => {
    // Add your logic for handling the form submission here
    console.log('Images:', selectedImages);
    console.log('Description:', description);
    // Reset form fields
    setSelectedImages([]);
    setDescription('');
    // handleClose();
  };

  const handleDelete = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  

  return (
    <>
    {/* <!-- Button trigger modal --> */}
{/* <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#${UPLOAD_MODAL_ID}`}
style={{display: 'flex'}}>
  Launch static backdrop modal
</button> */}

{/* <!-- Modal --> */}
<div 
  class="modal fade" 
  id={UPLOAD_MODAL_ID} 
  // data-bs-backdrop="static" 
  data-bs-keyboard="false" 
  tabindex="-1" 
  aria-labelledby={`${UPLOAD_MODAL_ID}Label`}
  aria-hidden="true"
  data-bs-show={true}
  data-bs-dismiss='modal'
  role='dialog'
  // style={{display: 'block'}}
  
>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 
          class="modal-title fs-4" 
          id={`${UPLOAD_MODAL_ID}Label`}
        >
          Upload information about the place
        </h1>
        <button 
          type="button" 
          class="btn-close"
          data-bs-dismiss="modal" 
          aria-label="Close"
        ></button>
      </div>
      <div className='modal-body'>
      <h3 
        class="fs-5" 
        for="images"
      >
        Choose image
      </h3>
      <label className="popup-button" for="images">
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
        <ul className="list" id="imageList">
        {selectedImages.map((file, index) => (
              <li key={index}>
                {file.name}
                <button
                  className="btn btn-link"
                  onClick={() => handleDelete(index)}
                >
                  &#10005; {/* Close (cross) symbol */}
                </button>
              </li>
            ))}
        </ul>

      </div>



        ...
      </div>


      <hr></hr>

      


      <div className='modal-body'>
        <h3 className='fs-5' for="description">Description:</h3>
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
      <div class="modal-footer">
        {/* <button type="button" class="btn btn-secondary popup-button" data-bs-dismiss="modal">Close</button> */}
        {/* <button type="button" class="btn btn-primary">Understood</button> */}
        <button
             className="popup-button"
             data-bs-dismiss="modal"
             id="submit"
             onClick={handleSubmit}
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

  // return (
  //   <div style={{ display: showModal ? 'block' : 'none' }}>
  //     <div id="popup">
  //       <h2>Upload Image</h2>
  //       <form id="uploadForm">
  //         <h3 for="images">Choose Image:</h3>
  //         <label className="popup-button" for="images">
  //           Choose Files
  //         </label>
  //         <input
  //           accept="image/*"
  //           id="images"
  //           multiple
  //           name="image"
  //           required
  //           style={{ display: 'none' }}
  //           type="file"
  //           onChange={handleImageChange}
  //         />
  //         <div id="uploadedImages">
  //           <h3>Uploaded Images:</h3>
  //           <ul className="list" id="imageList"></ul>
  //         </div>
  //         <h3 for="description">Description:</h3>
  //         <textarea
  //           cols="60"
  //           id="description"
  //           name="description"
  //           required
  //           rows="4"
  //           value={description}
  //           onChange={(e) => setDescription(e.target.value)}
  //         ></textarea>
  //         <br />
  //         <button
  //           className="popup-button"
  //           id="submit"
  //           onClick={handleSubmit}
  //           type="button"
  //         >
  //           Submit
  //         </button>
  //         <button
  //           className="popup-button"
  //           id="close"
  //           onClick={handleClose}
  //           type="button"
  //         >
  //           Close
  //         </button>
  //       </form>
  //     </div>
  //   </div>
  // );
}

export default UploadModal;
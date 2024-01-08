import React, { useState, useEffect } from 'react';

import { BASE_URL } from '../Challenges/GetDataFromDB.js';
import { UPLOAD_MODAL_ID } from './UploadModal.jsx' 

export function uploadRecord(latitude, longitude, images, description) {
    const formData = new FormData();
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('description', description);
    for (let i = 0; i < images.length; i++) {
        formData.append('image', images[i]);
    }

    fetch(`${BASE_URL}/api/record/upload`, {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
}
import React, { useState, useEffect } from 'react';

import { BASE_URL } from '../Challenges/GetDataFromDB.js';
import { UPLOAD_MODAL_ID } from './UploadModal.jsx' 

/*export function uploadRecord(latitude, longitude, images, description) {
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
}*/

export async function uploadRecord(latitude, longitude, images, description, isMarkerExists, markerId) {
    console.log('isMarkerExists: ', isMarkerExists, ' markerId: ', markerId, ' images: ', images);
    const formData = new FormData();
    if (isMarkerExists) {
        // console.log(JSON.stringify({"marker_id": markerId}));
        const jsonString = JSON.stringify({"marker_id": markerId});
        const blob = new Blob([jsonString], { type: 'application/json' });
        formData.append('marker_type', blob);
        //formData.append('marker_type', JSON.stringify({"marker_id": markerId}));
    } else {
        // formData.append('marker_type', JSON.stringify({"latlang": [latitude, longitude]}));
        // formData.append('marker_type', JSON.stringify({"latlang": [latitude, longitude]}), {type: 'application/json'});
        const jsonString = JSON.stringify({"latlang": [latitude, longitude]});

        const blob = new Blob([jsonString], { type: 'application/json' });
        formData.append('marker_type', blob);

    }

    // formData.append('latitude', latitude);
    // formData.append('longitude', longitude);
    formData.append('description', description);
    
    // for (const image of images) {
    //     formData.append('image', image);
    // }
    formData.append('files', images);

    try {
        // const response = await fetch(`${BASE_URL}/api/record/upload`, {
        const response = await fetch(`${BASE_URL}/api/records`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload record');
        }

        const json = await response.json();
        console.log(json);
    } catch (error) {
        //throw new Error('Failed to upload record');
        console.error(error);
        //return "";
    }
}





/*export function uploadRecord(latitude, longitude, images, description) {
    const formData = new FormData();
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('description', description);
    for (let i = 0; i < images.length; i++) {
        formData.append('image', images[i]);
    }

    return fetch(`${BASE_URL}/api/record/upload`, {
        method: "POST",
        body: formData,
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Failed to upload record: ${response.status} ${response.statusText}`);
        }
        console.log('that json: ', response.json());
        return response.json();
    })
    .then((json) => {
        console.log(json);
        return json; // Return the JSON data for further processing if needed
    })
    .catch((error) => {
        console.error('Error uploading record:', error);
        throw error; // Re-throw the error to be caught by the caller
    });
}
*/

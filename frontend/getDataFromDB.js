// fetch markers from the API
async function fetchMarkers() {
    try {
      const response = await fetch(`${API_BASE_URL}${MARKERS_API_ENDPOINT}`);
      if (!response.ok) {
        throw new Error('Failed to fetch markers');
      }
  
      const markers = await response.json();

      console.log( markers);
      //console.log("markers length0: " + markers.length)
      return markers;

    } catch (error) {
      console.error(error);
      return [];
    }
}

async function fetchRecordsForMarker(markerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/record/marker=${markerId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch records for marker ${markerId}`);
      }
  
      const records = await response.json();
      //console.log("records0: " + records.length)
      //console.log(records);
      return records;
  
    } catch (error) {
      console.error(error);
      return [];
    }
}


async function fetchRecordImage(markerId, photoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/record/marker=${markerId}/photo=${photoId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch records for marker's ${markerId} photo ${photoId}`);
      }
  
      //const photo = await response;
      //console.log("records0: " + records.length)
      const photo = await response.blob(); // or await response.blob();
    
      // Log specific details instead of the entire response object
      //console.log("Photo length:", photo.length);



      /*const imageUrl = URL.createObjectURL(photo);
      const imgElement = document.createElement('img');
      imgElement.src = imageUrl;
      document.body.appendChild(imgElement);*/
      


      return photo;
  
    } catch (error) {
      console.error(error);
      return "";
    }
}
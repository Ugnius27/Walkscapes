async function fetchMarkers() {
    try {
        const response = await fetch(`${MARKERS_API_ENDPOINT}`);
        if (!response.ok) {
            throw new Error('Failed to fetch markers');
        }

        const markers = await response.json();

        console.log(markers);
        //console.log("markers length0: " + markers.length)
        return markers;

    } catch (error) {
        console.error(error);
        return [];
    }
}

async function fetchRecordsForMarker(markerId) {
    try {
        const response = await fetch(`/api/record/marker=${markerId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch records for marker ${markerId}`);
        }

        const records = await response.json();
        return records;

    } catch (error) {
        console.error(error);
        return [];
    }
}


async function fetchRecordImage(markerId, photoId) {
    try {
        console.log("marker id: " + markerId + "   photo id:  " + photoId);

        const response = await fetch(`/api/record/marker=${markerId}/photo=${photoId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch records for marker's ${markerId} photo ${photoId}`);
        }

        const photo = await response.blob();
        return photo;

    } catch (error) {
        console.error(error);
        return "";
    }
}
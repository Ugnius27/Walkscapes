const BASE_URL = 'http://localhost:8080';

const MARKERS_API_ENDPOINT = '/api/record/markers';


export async function fetchMarkers() {
    try {
        const response = await fetch(`${BASE_URL}${MARKERS_API_ENDPOINT}`);
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

export async function fetchRecordsForMarker(markerId) { // not used
	try {
		const response = await fetch(`${BASE_URL}/api/record/marker=${markerId}`);
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

export async function fetchRecordImage(markerId, photoId) {
    try {
        console.log("marker id: " + markerId + "   photo id:  " + photoId);

        const response = await fetch(`${BASE_URL}/api/record/marker=${markerId}/photo=${photoId}`);
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

export async function fetchPolygons() {
    try {
        const response = await fetch(`${BASE_URL}/api/polygons`);
        if (!response.ok) {
            throw new Error(`Failed to fetch polygons`);
        }

        const polygons = await response.json();
        // console.log('polygons: ', polygons);
        return polygons;

    } catch (error) {
        console.error(error);
        return "";
    }
}

export async function fetchChallenges() {
    try {
        const response = await fetch(`${BASE_URL}/api/challenges`, {
            headers: {
                "Accept": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch challenges`);
        }

        const challenges = await response.json();
        console.log('challenges: ', challenges);
        return challenges;

    } catch (error) {
        console.error(error);
        return "";
    }
}
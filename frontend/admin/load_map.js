let challenges = null;

async function fetch_from_db() {
    data = await fetch(`${API_PATH}/challenges`)
        .then(response => {
            // Check if the request was successful (status code 200)
            if (!response.ok) {
                console.log("Failed to fetch")
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    return data;
}

async function load_map_data() {
    let challenges = await fetch_from_db();
    challenges.forEach(challenge => {
        let polygon = L.polygon(challenge.polygon.vertices).addTo(map);
        polygons[polygon._leaflet_id] = [challenge.polygon.id];
        polygon.on('click', on_polygon_click);

        map.fitBounds(polygon.getBounds());

        challenge.markers.forEach(marker => {
            let mark = L.marker([marker.latitude, marker.longitude]).addTo(map);
            markers[marker.id] = mark
            polygon_markers[marker.id] = polygon._leaflet_id;
        })
    })
    console.log(polygons)
    console.log(polygon_markers)

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Set the appropriate content type
        },
        body: JSON.stringify(challenges) // Convert data to JSON format if needed
    };

    // Perform the POST request using fetch
    fetch(`${API_PATH}/challenges`, requestOptions)
        .then(response => response)
        .then(data => {
            console.log('Response:', data);
            // Handle the response as needed
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle errors
        });
}

document.addEventListener('DOMContentLoaded', load_map_data);
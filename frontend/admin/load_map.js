async function fetch_json(endpoint) {
    data = await fetch(`${API_PATH}/${endpoint}`, {
        headers: {
            "Accept": "application/json"
        }
    })
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


async function load_polygons() {
    let polys = await fetch_json('polygons');
    if (polys == null) {
        console.error("Could not fetch polygons");
        return;
    }
    polys.forEach(poly => {
        let polygon = L.polygon(poly.vertices);

        polygons_layer.addLayer(polygon);
        polygons_to_ids[polygon._leaflet_id] = poly.id;
        ids_to_polygons[poly.id] = polygon._leaflet_id;
        polygon.on('click', on_polygon_click);

        map.fitBounds(polygon.getBounds());
    })
}

async function load_markers() {
    let marks = await fetch_json('record/markers');
    if (marks == null) {
        console.error("Could not fetch markers");
        return;
    }

    marks.forEach(marker => {
        markers[marker.id] = L.marker([marker.latitude, marker.longitude]).addTo(map);
    });
}

async function load_map_data() {
    await load_polygons();
    await load_markers();
}

document.addEventListener('DOMContentLoaded', load_map_data);
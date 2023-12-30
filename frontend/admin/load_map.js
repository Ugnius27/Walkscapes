var challenges = null

class Polygon {
    constructor(id, vertices) {
        this.id = id;
        this.vertices = vertices;
    }
}

class Marker {
    constructor(id, latitude, longitude) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}

class Challenge {
    constructor(id, title, description, polygon, markers) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.polygon = polygon;
        this.markers = markers
    }
}

async function fetch_from_db() {
    data = await fetch('http://localhost:8080/api/challenges')
        .then(response => {
            // Check if the request was successful (status code 200)
            if (!response.ok) {
                console.log("Failed to fetch")
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            challenges = data;
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

fetch_from_db().then(() => {
    console.log(challenges);
});

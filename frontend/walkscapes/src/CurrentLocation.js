export function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    //console.log("Latitude: " + latitude + ", Longitude: " + longitude);
                    resolve([latitude, longitude]);
                },
                function(error) {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            console.error("User denied the request for Geolocation.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.error("Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            console.error("The request to get user location timed out.");
                            break;
                        default:
                            console.error("An unknown error occurred.");
                    }
                    //reject(error);
					return [-1, -1]
                }
            );
        } else {
            console.error("Geolocation is not supported by your browser.");
            //reject(new Error("Geolocation is not supported by your browser."));
			return [-1, -1]
        }
    });
}

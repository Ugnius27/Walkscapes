document.addEventListener("DOMContentLoaded", function () {
    // Fetch image URL
    fetchImage();
});

function fetchImage() {
    // Replace the URL with the actual URL of the image you want to fetch
    const imageUrl = "api/image/cat.jpg";

    // Fetch image using the Fetch API
    fetch(imageUrl)
        .then(response => {
            // Check if the request was successful (status code 200)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Convert the response to blob
            return response.blob();
        })
        .then(blob => {
            // Create an object URL from the blob
            const imageUrl = URL.createObjectURL(blob);

            // Display the image
            displayImage(imageUrl);
        })
        .catch(error => {
            console.error("Error fetching image:", error);
        });
}

function displayImage(imageUrl) {
    // Get the image element by its ID
    const imageElement = document.getElementById("dbImage");

    // Set the source of the image element to the fetched URL
    imageElement.src = imageUrl;
}
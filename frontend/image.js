document.addEventListener("DOMContentLoaded", function () {
    fetchImage();
});

function fetchImage() {
    const imageUrl = "api/image/cat.jpg";

    fetch(imageUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.blob();
        })
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob);

            displayImage(imageUrl);
        })
        .catch(error => {
            console.error("Error fetching image:", error);
        });
}

function displayImage(imageUrl) {
    const imageElement = document.getElementById("dbImage");
    imageElement.src = imageUrl;
}
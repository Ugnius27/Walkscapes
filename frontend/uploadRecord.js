function uploadRecord() {
    const form = document.getElementById('uploadForm');
    const images = form.querySelector('#images').files;
    const latitude = form.querySelector('#latitude').value;
    const longitude = form.querySelector('#longitude').value;
    const description = form.querySelector('#description').value;

    const formData = new FormData();
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('description', description);
    for (let i = 0; i < images.length; i++) {
        formData.append('image', images[i]);
    }

    fetch("api/record/upload", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
}
function uploadRecord() {
    const fileInput = document.getElementById('photoUpload');
    const file = fileInput.files[0];

    if(file) {
        const formData = new FormData();
        formData.append('photo', file);

        fetch('api/image/upload', {
            method: 'POST',
            body: formData,
            headers: {},
        }).then(response => response.json())
            .then(data => console.log('Upload successful', data))
            .catch(error => console.log('Error uploading photo', error));
    } else {
        console.log('No file selected');
    }
}
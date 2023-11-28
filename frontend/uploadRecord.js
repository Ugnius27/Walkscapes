let imageList = [];

function uploadRecord(latitude, longitude) {
    const form = document.getElementById('uploadForm');
    // console.log("UPLOAD:     " + latitude + "   " + longitude);
    const description = form.querySelector('#description').value;

    const formData = new FormData();
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('description', description);
    for (let i = 0; i < imageList.length; i++) {
        formData.append('image', imageList[i]);
    }

    fetch("api/record/upload", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
}

function updateImageList() {
    var imageListContainer = document.getElementById('imageList');
    const newImages = document.getElementById('images').files;

    for (let i = 0; i < newImages.length; i++) {
        const li = document.createElement('li');
        var deleteButton = L.DomUtil.create('delete-button', 'delete-button');
        li.textContent = newImages[i].name;
        (function(index) {
            var imgElement = document.createElement('img');
            imgElement.src = 'black_cross.png';
            imgElement.alt = 'My Image';
            imgElement.style.width = '15px'; 
            imgElement.style.height = '15px';
            deleteButton.appendChild(imgElement);

            deleteButton.addEventListener('click', function(e) {
                e.preventDefault();
                deleteImage(index);
            });
        })(i);
        li.appendChild(deleteButton);
        imageListContainer.appendChild(li);
    }
    
    // console.log(imageListContainer);
    imageList = imageList.concat( Array.from(newImages));
    // console.log(imageList);
    toggleImagesList();

}

function toggleImagesList(){
    var uploadedImagesContainer = document.getElementById('uploadedImages');
    uploadedImagesContainer.style.display = imageList.length > 0 ? 'block' : 'none';
    console.log(imageList);
    console.log("111111111111");
}

function deleteImage(index) {
    const imageListContainer = document.getElementById('imageList');
    imageListContainer.removeChild(imageListContainer.children[index]);
    imageList.splice(index, 1);

    toggleImagesList();
}

function cleanOverlayData(){
    imageList = [];
    var imageListContainer = document.getElementById('imageList');
    imageListContainer.innerHTML = "";
}
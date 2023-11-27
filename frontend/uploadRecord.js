let imageList = [];


function uploadRecord(latitude, longitude) {
    const form = document.getElementById('uploadForm');
    console.log("UPLOAD:     " + latitude + "   " + longitude);
    var images = imageList;  ///////

    // same thing
    console.log("normal:");
    console.log(form.querySelector('#images').files[0]);
    console.log("mine:");
    console.log(imageList[0]);
//-------------

    ///////////////////
    // const images = form.querySelector('#images').files;
    // const latitude = form.querySelector('#latitude').value;
    // const longitude = form.querySelector('#longitude').value;
    // const description = form.querySelector('#description').value;

    // const formData = new FormData();
    // formData.append('latitude', latitude);
    // formData.append('longitude', longitude);
    // formData.append('description', description);
    // for (let i = 0; i < images.length; i++) {
    //     formData.append('image', images[i]);
    // }

    // fetch("api/record/upload", {
    //     method: "POST",
    //     body: formData,
    // })
    //     .then((response) => response.json())
    //     .then((json) => console.log(json));
}

function updateImageList() {
    var imageListContainer = document.getElementById('imageList');
    const newImages = document.getElementById('images').files;

    for (let i = 0; i < newImages.length; i++) {
        const li = document.createElement('li');
        //const deleteButton = document.createElement('button');
        var deleteButton = L.DomUtil.create('delete-button', 'delete-button');
        li.textContent = newImages[i].name;
        (function(index) {
            //deleteButton.textContent = 'Delete';
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
    
    console.log(imageListContainer);
    imageList = imageList.concat( Array.from(newImages));
    console.log(imageList);



    // var uploadedImagesContainer = document.getElementById('uploadedImages');
    // uploadedImagesContainer.style.display = imageList.length > 0 ? 'block' : 'none';
    // console.log("000000000000000");
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
// var uploadedImagesContainer = document.getElementById('uploadedImages');
//     uploadedImagesContainer.style.display = imageList.length > 0 ? 'block' : 'none';
//     console.log(imageList);
//     console.log("111111111111");
    //updateImageList()
}

function cleanOverlayData(){
    imageList = [];
    var imageListContainer = document.getElementById('imageList');
    imageListContainer.innerHTML = "";
}

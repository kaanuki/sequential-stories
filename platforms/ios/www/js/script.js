/*
NN Plots

cvalenzuela
*/

document.addEventListener("deviceready", onDeviceReady, false);

var imageURL;
var ip = 'http://172.16.220.175:8080/'
var upload = ip + "upload";
var id = 1;
var currentImageHolder = null;
var currentImage = null;
var photo = null;


// on device ready
function onDeviceReady() {
  currentImageHolder = document.getElementById('currentImageHolder');
  currentImage = document.getElementById('currentImage');
  $("#currentImageHolder").hide();
}

// Get data AJAX
$('#data').click(function() {
  $.ajax({
    url: ip,
    type: 'GET',
    cache: false,
    error: function() {
      $('#info').html('<p>An error has occurred</p>')
    },
    success: function(data) {
      $('#info').html(data)
    }
  });
});

// Use camara
function useCamara() {
  navigator.camera.getPicture(cameraSuccess, cameraError, {
    quality: 50,
    allowEdit: true,
    destinationType: navigator.camera.DestinationType.DATA_URL
  });
};

// Use an existig photo
function getImage() {
  navigator.camera.getPicture(cameraSuccess, cameraError, {
    quality: 50,
    destinationType: navigator.camera.DestinationType.FILE_URI,
    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
  });
}

// Display Image taken/selected
function cameraSuccess(imageData) {
  console.log('Got image')
  imageURL = imageData;
  $("#currentImageHolder").show();
  // currentImage.src = "data:image/jpeg;base64," + imageData;
  currentImage.src = imageData;
}

// Upload image to server
function uploadPhoto() {
  console.log('Upload Image')
  $("#currentImageHolder").hide();
  currentImage.src = '#';
  photo = document.getElementById('photo'+id);
  //photo.src = "data:image/jpeg;base64," + imageURL;
  photo.src = imageURL;
  (id < 9) ? id++ : id = 0;

  // var base64 = imageURL;
  // var cleaned = base64.replace(/data:image\/(png|jpeg|jpg|gif);base64,/, '');
  // var data = {
  //   img: cleaned
  // }

  // send the data
  // $.post(upload, "data", function(response) {
  //   console.log(response.term)
  //   $("#genTitle").text(response.term);
  //   Typed.new('#genPar', {
  //     strings: [response.text],
  //     typeSpeed: 0
  //   });
  //   console.log(response)
  // });

  var options = new FileUploadOptions();
  options.fileKey="file";
  options.fileName=imageURL.substr(imageURL.lastIndexOf('/')+1);
  options.mimeType="image/jpeg";

  var params = new Object();
  params.value1 = "test";
  params.value2 = "param";

  options.params = params;
  options.chunkedMode = true;

  var ft = new FileTransfer();
  ft.upload(imageURL, upload, win, fail, options);
}

function cameraError(){
  alert("Error Classifying Image :(")
}

function clearAll(){
  $("#currentImageHolder").hide();
  currentImage.src = '#';
  $("#genTitle").text( " " );
  $("#genPar").text( " " );

  for (var i = 1; i < 10; i++){
    var img = document.getElementById('photo'+i);
    img.src = 'img/noImage.jpg'
  }
  id = 1;
}

function removePhoto(){
  $("#currentImageHolder").hide();
  currentImage.src = '#';
  if (id > 1){
    id = id - 1
  }
  document.getElementById('photo'+id).src = 'img/noImage.jpg'
}

function win(r) {
  var response =  JSON.parse(r.response);
  console.log(r)
  console.log("File Uploaded " + response.status);
    //$("#genTitle").text(response.term);
    Typed.new('#genPar', {
      strings: [response.text],
      typeSpeed: 0
    });

}

function fail(error) {
  alert("An error has occurred: Code = " = error.code);
}

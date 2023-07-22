function start(){
  "use strict";
  const editBtn = document.querySelector(".edit-btn");
const inputEdit = document.querySelectorAll('input[type="text"], textarea[type="text"], select, input[type="date"]');
const dpEdit = document.querySelectorAll('#file-upload');
const docEdit = document.querySelectorAll('#select-file');
const downloadBtn = document.getElementById('download-btn');
const selectEdit = document.querySelectorAll('select');
const customUpload = document.querySelectorAll(".custom-file-upload");
const saveBtn = document.getElementById("save-btn");

editBtn.addEventListener("click", function () {

  inputEdit.forEach(function (input) {
    input.classList.toggle("input-edit");
    input.readOnly = !input.readOnly;
  });
  docEdit.forEach(function (input) {
    input.disabled = !input.disabled;
  });
  dpEdit.forEach(function (input) {
    input.disabled = !input.disabled;
  });

  selectEdit.forEach(function (select) {
    select.disabled = !select.disabled;

  });
 

  editBtn.classList.toggle("edit-btn-clicked");
//   selectEdit.disabled = false;

if (editBtn.classList.contains("edit-btn-clicked")) {
    saveBtn.style.display = "block";
    customUpload.forEach(function(doc){
      doc.classList.remove("input-read");
      doc.classList.add("input-edit");
      downloadBtn.style.display = "none";
    });
  } else {
    saveBtn.style.display = "none";
    customUpload.forEach(function(doc){
      doc.classList.add("input-read");
      doc.classList.remove("input-edit");
      downloadBtn.style.display = "block";
    });
    // dpEdit.addAttribute("disabled")
    // docEdit.addAttribute("disabled");
  }


});
}
start();



// image upload js
function uploadImage(){
"use strict";
const image = document.getElementById("image");
const fileUpload = document.getElementById("file-upload");

fileUpload.addEventListener("change", function(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    image.src = e.target.result;
  };

  reader.readAsDataURL(file);
});
}
uploadImage();
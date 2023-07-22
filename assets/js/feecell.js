let selectFile = document.getElementById("select-file");
let fileName = document.getElementById("file-name");
let importIcon = document.querySelector(".import-icon");
let submitBtn = document.querySelector("#submit-btn");

selectFile.addEventListener("change", function (e) {
    console.log(selectFile.files[0].name);
    fileName.innerHTML = (selectFile.files[0].name).slice(0,20)+"..";

})


selectFile.addEventListener("change", function() {
if (selectFile.files.length > 0) {
importIcon.style.display = "block";
submitBtn.style.opacity = "1";
}

});

importIcon.addEventListener("mousedown", function(e) {
e.preventDefault(); // Prevents the default behavior of the click event
selectFile.value = "";
fileName.innerHTML = "Import your file here";
importIcon.style.display = "none";
submitBtn.style.opacity = "0.4";
});




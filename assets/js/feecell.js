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

// - - - - - 
// select 1
// - - - - - 

const optionMenu = document.querySelector(".select-menu"),
       selectBtn = optionMenu.querySelector(".select-btn"),
       options = optionMenu.querySelectorAll(".option"),
       sBtn_text = optionMenu.querySelector(".sBtn-text");
selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));

options.forEach(option =>{

    option.addEventListener("click", ()=>{
        let selectedOption = option.querySelector(".option-text").innerText;
        sBtn_text.innerText = selectedOption;
        optionMenu.classList.remove("active");
    });

});
document.addEventListener("click", (event) => {
	if (!optionMenu.contains(event.target)) {
	  optionMenu.classList.remove("active");
	}
  });


//   - - - - - 
// select 3
//   - - - - -  

const optionMenu1 = document.querySelector(".select-menu1"),
selectBtn1 = optionMenu1.querySelector(".select-btn1"),
options1 = optionMenu1.querySelectorAll(".option1")
//    sBtn_text1 = optionMenu.querySelector(".sBtn-text1");
selectBtn1.addEventListener("click", () => optionMenu1.classList.toggle("active"));
options1.forEach(option => {
option.addEventListener("click", () => {
    // let selectedOption = option.querySelector(".option-text").innerText;
    // sBtn_text.innerText = selectedOption;
    optionMenu1.classList.remove("active");
});
});
document.addEventListener("click", (event) => {
if (!optionMenu1.contains(event.target)) {
    optionMenu1.classList.remove("active");
}
});


//   - - - - - 
// select 3
//   - - - - - 

const optionMenu2 = document.querySelector(".select-menu2"),
selectBtn2 = optionMenu2.querySelector(".select-btn2"),
options2 = optionMenu2.querySelectorAll(".option2")
//    sBtn_text1 = optionMenu.querySelector(".sBtn-text1");
selectBtn2.addEventListener("click", () => optionMenu2.classList.toggle("active"));
options2.forEach(option => {
option.addEventListener("click", () => {
    // let selectedOption = option.querySelector(".option-text").innerText;
    // sBtn_text.innerText = selectedOption;
    optionMenu2.classList.remove("active");
});
});
document.addEventListener("click", (event) => {
if (!optionMenu2.contains(event.target)) {
    optionMenu2.classList.remove("active");
}
});



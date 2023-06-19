const tabItems = document.querySelectorAll('.tab-item');
const tabContentItems = document.querySelectorAll('.tab-content-item');

// Select tab content item
// function selectItem(e) {
// 	// Remove all show and border classes
// 	removeBorder();
// 	removeShow();
// 	// Add border to current tab item
// 	this.classList.add('tab-border');
// 	this.classList.add('tab-item');
// 	// Grab content item from DOM
// 	const tabContentItem = document.querySelector(`#${this.id}-content`);
// 	// Add show class
// 	tabContentItem.classList.add('show');
// }

// Remove bottom borders from all tab items
// function removeBorder() {
// 	tabItems.forEach(item => {
// 		item.classList.remove('tab-border');
// 		item.classList.remove('tab-item');
// 	});
// }

// // Remove show class from all content items
// function removeShow() {
// 	tabContentItems.forEach(item => {
// 		item.classList.remove('show');
// 	});
// }

// // Listen for tab item click
// tabItems.forEach(item => {
// 	item.addEventListener('click', selectItem);
// });


function view_update(value) {
	var view = document.getElementById('view-tab');
	var add = document.getElementById('add-tab');
	var update = document.getElementById('update-tab');
	if (value === "view") {
		console.log(value);
		update.style.display = "none";
		add.style.display = "none";
		view.style.display = "contents";
	}
	if(value === "add") {
		console.log(value);
		add.style.display = "contents";
		view.style.display = "none";
		update.style.display = "none";
	}
	if(value === "update") {
		console.log(value);
		update.style.display = "contents";
		view.style.display = "none";
		add.style.display = "none";
	}
}
let resetmax = document.getElementById('reset-max');
function addsub(){
    resetmax.style.display = "flex";
}
function closemodal(){
    resetmax.style.display = "none";
}
let resetall = document.getElementById('reset-all');
function resetmodel(){
    resetall.style.display = "flex";
}
function closeresetmodal(){
    resetall.style.display = "none";
}

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

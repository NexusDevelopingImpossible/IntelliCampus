const tabItems = document.querySelectorAll('.tab-item');
const tabContentItems = document.querySelectorAll('.tab-content-item');


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

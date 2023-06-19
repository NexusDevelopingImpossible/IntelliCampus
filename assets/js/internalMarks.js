/* Internal Marks */
const select = document.getElementById('selection__mode');

// adding the active class
select.addEventListener('click', () => {
    select.classList.toggle('active');
});



// new select

// const optionMenu = document.querySelector(".select-menu"),
//        selectBtn = optionMenu.querySelector(".select-btn"),
//        options = optionMenu.querySelectorAll(".option"),
//        sBtn_text = optionMenu.querySelector(".sBtn-text");
// selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));       
// options.forEach(option =>{
//     option.addEventListener("click", ()=>{
//         let selectedOption = option.querySelector(".option-text").innerText;
//         sBtn_text.innerText = selectedOption;
//         optionMenu.classList.remove("active");
//     });
// });
const editBtn = document.querySelector(".edit-btn");
const inputEdit = document.querySelectorAll('input[type="text"], textarea[type="text"], select');
const selectEdit = document.querySelectorAll('select');
const saveBtn = document.querySelector(".popup-btns");

editBtn.addEventListener("click", function () {

  inputEdit.forEach(function (input) {
    input.classList.toggle("input-edit");
    input.readOnly = !input.readOnly;
  });
  selectEdit.forEach(function (select) {
    select.disabled = !select.disabled;

  });
  editBtn.classList.toggle("edit-btn-clicked");
//   selectEdit.disabled = false;

if (editBtn.classList.contains("edit-btn-clicked")) {
    saveBtn.style.display = "block";
  } else {
    saveBtn.style.display = "none";
  }


});


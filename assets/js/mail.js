
const composeButton = document.getElementById("compose__btn");
const cross = document.getElementById("close");
const popup = document.querySelector(".popup");
const modal = document.querySelector(".modal");


composeButton.addEventListener("click", function () {
  popup.style.display = "flex";
  modal.style.display = "block";
});
cross.addEventListener("click", function () {
  popup.style.display = "none";
  modal.style.display = "none";
});


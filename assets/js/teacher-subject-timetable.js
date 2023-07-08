// function changeContent(slide) {
//   card.getElementsByClassName("cont-def")[0].style.display = "none";
//   card.getElementsByClassName("cont-hover")[0].style.display = "block";
// }

// function restoreContent(slide) {
//   card.getElementsByClassName("cont-hover")[0].style.display = "none";
//   card.getElementsByClassName("cont-def")[0].style.display = "block";
// }


let leftbtn = document.querySelector(".left-control");
let rightbtn = document.querySelector(".right-control");
let scrollcontainer = document.querySelector(".carousel-container");
// let scrollcontent = document.querySelector(".carousel");

scrollcontainer.scroll({
  right: 10500, 
  // left: 0, 
  behavior: 'smooth'
});

document.addEventListener("DOMContentLoaded", function() {

  leftbtn.addEventListener("click", function() {
    scrollcontainer.scrollLeft -= 330;
  });

  rightbtn.addEventListener("click", function() {
    scrollcontainer.scrollLeft += 330;
  });
});

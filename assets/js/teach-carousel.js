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


// search bar

document.getElementById("reg").addEventListener("input", function() {
  // Get the input value
  var inputValue = document.getElementById("reg").value;

  // Set the input value as the text content of the <a> element
  var anchorTag = document.getElementById("reg-path");
  anchorTag.href = "/teacher/search/" + inputValue;
});
document.getElementById("reg").addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    var anchorTag = document.getElementById("reg-path");
    document.getElementById('search-btn').style.backgroundColor = "#0000006a";
    anchorTag.click(); // Simulate a click on the anchor tag
  }
});
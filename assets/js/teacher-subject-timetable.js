function changeContent(slide) {
  card.getElementsByClassName("cont-def")[0].style.display = "none";
  card.getElementsByClassName("cont-hover")[0].style.display = "block";
}

function restoreContent(slide) {
  card.getElementsByClassName("cont-hover")[0].style.display = "none";
  card.getElementsByClassName("cont-def")[0].style.display = "block";
}

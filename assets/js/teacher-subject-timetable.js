function changeContent(sl) {
  card.getElementsByClassName("cont-def")[0].style.display = "none";
  card.getElementsByClassName("cont-hover")[0].style.display = "block";
}

function restoreContent(sl) {
  card.getElementsByClassName("cont-hover")[0].style.display = "none";
  card.getElementsByClassName("cont-def")[0].style.display = "block";
}

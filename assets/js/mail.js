const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const composeButton = document.getElementById("compose__btn");
const closeButton = document.getElementById("close");

// adding the show class
composeButton.addEventListener('click', () => {
    modal.classList.add('show');
    overlay.classList.add('show')
});

closeButton.addEventListener('click' ,() => {
    modal.classList.remove('show');
    overlay.classList.remove('show')
});

overlay.addEventListener('click' ,() => {
    modal.classList.remove('show');
    overlay.classList.remove('show')
});
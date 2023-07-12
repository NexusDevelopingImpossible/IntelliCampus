const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const createButton = document.getElementById("create__btn");
const closeButton = document.getElementById("close");

// adding the show class
createButton.addEventListener('click', () => {
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

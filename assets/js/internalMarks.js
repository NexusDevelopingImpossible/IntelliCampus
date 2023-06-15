/* Internal Marks */
const select = document.getElementById('selection__mode');

// adding the active class
select.addEventListener('click', () => {
    select.classList.toggle('active');
});

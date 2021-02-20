let burger  = document.querySelector('.hamburger');
let overlay = document.querySelector('.overlay');
let body = document.querySelector('body');
let links = document.querySelectorAll('.menu-mobile__link');

links.forEach(function(element) {
    element.addEventListener('click', toggleMenu);
})

function toggleMenu() {
    burger.classList.toggle('hamburger--active');
    overlay.classList.toggle('overlay--active');
    body.classList.toggle('body--active-menu');
} 

burger.addEventListener('click', toggleMenu);
const slider = $('.products').bxSlider({
    pager: false,
    controls: false,
    speed: 800
});

$('.product-slider__arrow--direction--prev').click(e => {
    e.preventDefault();
    slider.goToPrevSlide();
})

$('.product-slider__arrow--direction--next').click(e => {
    e.preventDefault();
    slider.goToNextSlide();
})

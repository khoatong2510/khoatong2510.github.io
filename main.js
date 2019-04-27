$("#webdev").click(function() {
    $('html, body').animate({
        scrollTop: $('#portfolioSection').offset().top
    }, 'slow');
});

$("#gamedev").click(function() {
    $("#gameSection").scroll();
});

$("#artMusic").click(function() {
    $("#artMusicSection").scroll();
});

$(document).ready(function() {
    $('.topicBox#webdev').click(function() {
        $('body, html').animate({
            scrollTop: $(".portfolioContainer#portfolioSection").offset().top
          }, 0);
    });
    $('.topicBox#gamedev').click(function() {
        $('body, html').animate({
                scrollTop: $(".gameContainer#gameSection").offset().top
        }, 0);
    });
    $('.topicBox#artMusic').click(function() {
        $('body, html').animate({
                scrollTop: $(".artMusicContainer#artMusicSection").offset().top
        }, 0);
    });
    
})
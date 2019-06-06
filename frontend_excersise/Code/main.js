$(document).ready(function () {
    $('.scroll').click(function () {
        $('body, html').animate({
            scrollTop: $(".chill").offset().top
        }, 0);
    });

    function isScrolledIntoView(elem) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
    
        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();
       
        return ((elemTop <= docViewBottom) && (elemBottom >= docViewTop));
    }

    var toggle = function() {
        if (isScrolledIntoView('.chill')) {
            $('.left #contentImg').addClass('introAnim');
        } else {
            $('.left #contentImg').removeClass('introAnim');
        }
    }

    $(window).on('scroll', toggle);


});
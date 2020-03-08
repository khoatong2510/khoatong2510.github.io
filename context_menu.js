import { init_orgchart } from './org_chart.js';
$(function($) {
    $(document).click(function(e) {
        $(".contextmenu").hide();
    });

    var editAttrbNode = '';

    $('.node').on('contextmenu', function(e) {
        e.preventDefault();
        editAttrbNode = $(this);
        var winWidth = $(document).width();
        var winHeight = $(document).height();

        var posX = e.pageX;
        var posY = e.pageY;

        var menuWidth = $('.contextmenu').width();
        var menuHeight = $('.contextmenu').height();

        var secMargin = 10;
        var posLeft = '';
        var posTop = '';

        if (posX + menuWidth + secMargin >= winWidth &&
            posY + menuHeight + secMargin >= winHeight) {
                posLeft = posX - menuWidth - secMargin + 'px';
                posTop = posY - menuHeight - secMargin + 'px';
            } 
        else if (posX + menuWidth + secMargin >= winWidth) {
            posLeft = posX + secMargin + 'px'; 
            posTop = posY + secMargin + 'px';
        }
        else if (posY + menuHeight + secMargin >= winHeight) {
            posLeft = posX + secMargin + 'px';
            posTop = posY - menuHeight - secMargin + 'px';
        } else {
            posLeft = posX + secMargin + 'px';
            posTop = posY + secMargin + 'px';
        }

        $('.contextmenu').css({
            "left": posLeft,
            "top" : posTop
        }).show();

        return false;
    });
    
    $('.contextmenu li a.title-change').click(function(e) {
        e.preventDefault();
        $(editAttrbNode).find('.title').text($(this).text()); 
        $(".contextmenu").hide();
    });
    
    var getId = function() {
        return (new Date().getTime()) * 1000 + Math.floor(Math.random() * 1001); 
    }
    
    $('.contextmenu li a.send-to-tab').click(function(e) {
        e.preventDefault();
        //find the index
        var lastChild = $('.tab-menu li:last-child');
        var index = $('.tab-menu li').index(lastChild) + 1;
        
        $('ul.tab-menu').append('<li class="active" data-tab="tab'+ index + '">tab #' + index + '</li>');
        $('div.tab-content').append('<div data-tab="tab' +index +'"><div class="chart-container" id="cc' + index +'"></div></div>');

        let name = $(editAttrbNode).find('.title').text();

        var ds = {
            'name': name,
            'relationship': '000',
        };

       init_orgchart(ds, '#cc' + index);

        var $wrapper = $('.tab-wrapper'),
                $allTabs = $wrapper.find('.tab-content > div'),
                $tabMenu = $wrapper.find('.tab-menu li'),
                $line = $('<div class="line"></div>').appendTo($tabMenu);

            $allTabs.not(':first-of-type').hide();
            $tabMenu.filter(':first-of-type').find(':first').width('100%');

            $tabMenu.each(function(i) {
                $(this).attr('data-tab', 'tab' + i);
            });

            $allTabs.each(function(i) {
                $(this).attr('data-tab', 'tab' + i);
            });

            $tabMenu.on('click', function() {
                var dataTab = $(this).data('tab'),
                    $getWrapper = $(this).closest($wrapper);

                $getWrapper.find($tabMenu).removeClass('active');
                $(this).addClass('active');

                $getWrapper.find('.line').width(0);
                $(this).find($line).animate({'width':'100%'}, 'fast');
                $getWrapper.find($allTabs).hide();
                $getWrapper.find($allTabs).filter('[data-tab=' + dataTab + ']').show();
            });
    });
});


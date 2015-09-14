var HLG_UX = (function() {
    'use strict';

    var scrollController = new ScrollMagic.Controller({
        globalSceneOptions: {
            triggerHook: 'onLeave',
            reverse: true
        }
    });

    var isOverlap = function(idOne,idTwo){
        var objOne=$(idOne),
            objTwo=$(idTwo),
            offsetOne = objOne.offset(),
            offsetTwo = objTwo.offset(),
            topOne=offsetOne.top,
            topTwo=offsetTwo.top,
            leftOne=offsetOne.left,
            leftTwo=offsetTwo.left,
            widthOne = objOne.width(),
            widthTwo = objTwo.width(),
            heightOne = objOne.height(),
            heightTwo = objTwo.height();
        var leftTop = leftTwo > leftOne && leftTwo < leftOne+widthOne
                && topTwo > topOne && topTwo < topOne+heightOne,
            rightTop = leftTwo+widthTwo > leftOne && leftTwo+widthTwo < leftOne+widthOne
                && topTwo > topOne && topTwo < topOne+heightOne,
            leftBottom = leftTwo > leftOne && leftTwo < leftOne+widthOne
                && topTwo+heightTwo > topOne && topTwo+heightTwo < topOne+heightOne,
            rightBottom = leftTwo+widthTwo > leftOne && leftTwo+widthTwo < leftOne+widthOne
                && topTwo+heightTwo > topOne && topTwo+heightTwo < topOne+heightOne;
        return leftTop || rightTop || leftBottom || rightBottom;
    };

    var handleNavClick = function(e) {
        e.preventDefault();

        switch($(this).attr('href').split('/')[1]) {
            case 'services':
                location.href='services.html';
                break;
            case 'people':
                location.href='people.html';
                break;
            case 'news':
                location.href='news.html';
                break;
            case 'network':
                location.href='network.html';
                break;
            case 'notebook':
                location.href='notebook.html';
                break;
            case 'careers':
                location.href='careers.html';
                break;
            case 'contact':
                location.href='contact.html';
                break;
        }
    };

    var initNav = function() {

        $('.menu').on('click', function() {
            $('body').toggleClass('open');
            $('.navdrawer-container').toggleClass('open');
        });

        $('a[href="#down"]').on('click', function() {
            $('html, body').animate({scrollTop: $(window).height()}, 1000);
        });

    };

    var initHomepageCarousel = function() {

        $('.carousel').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 10000
        });

        // On before slide change
        $('.carousel').on('beforeChange', function(event, slick, currentSlide, nextSlide){
            $('.slick-arrow, h2').toggleClass('fade');
        });

        $('.carousel').on('afterChange', function(event, slick, currentSlide, nextSlide){
            $('.slick-arrow, h2').toggleClass('fade');
            ColorResponsive.init({
                target: '.app-bar',
                threshold: 'rgb(200,200,200)'
            });
        });

        setTimeout(function() {
            $('.carousel h2').each(function(){
                // $(this).find('span').css('font-size',$('.slick-slide').width()*0.04);
                // $(this).width($('.slick-slide').width()*0.5);
                // $(this).width($(this).find('span').width());     Original code
            })

        }, 1000)
    };

    var fitHeight = function(height) {
        if ($(window).width() >= 768) {
            $('main .section').css('height', height);
        } else {
            $('main .section.slide, main .section.carousel').css('height', height);
        }
    };

    var add_and_remove_active_class = function (index) {
        $('.bottom-nav').addClass('fixed')
        $('.bottom-nav ul li').removeClass('active');
        $('.bottom-nav ul li:nth-child(' + index + ')').children('a').parent().last().addClass('active');    
    };

    var handleServicesNav = function(allScenes) {

        /* move to corresponding section,smoothly when clicked on any nav item*/  
        $('a[href*=#]:not([href=#])').click(function () {
            var id = $(this).attr('href').replace('#','');
            
            if($(this).parent().parent().parent().hasClass('bottom-nav')) {
                var index = $('.bottom-nav ul li a').index($(this));
            }else {
                var index = $('ul.wrap li a').index($(this));
            }

            if(id == 'down') {
                setTimeout(function () {
                    $('.bottom-nav').addClass('fixed')
                },1100)
            }
            else {
                var targetted_scene = allScenes[index + 1]; // as nav doesn't count the first slide.
                if(targetted_scene.id == id) {
                    $('html,body').animate({scrollTop: targetted_scene.scene.scrollOffset()},1000);
                    return false; 
                }
            }
        });

        var actual_positions = [];
        var mid_points = [];

        /* get mid points of sections*/
        for(var index in allScenes) {
            var scene = allScenes[index].scene;
            
            actual_positions.push(Math.ceil(scene.triggerPosition()));

            if(actual_positions.length > 1) {
                mid_points.push((actual_positions[index] + actual_positions [index-1]) / 2);
            }
        }

        /*add active class to the nav item, when the section is half way through*/
        $(window).scroll(function () {
            for(var index=0; index<mid_points.length; index++) {

                var next_index = index+1;
                var last_index = mid_points.length-1

                /* check between mid point ranges and set active class to the respective nav item. */
                if($(window).scrollTop() > mid_points[index] && $(window).scrollTop() < mid_points[next_index]) {
                    add_and_remove_active_class(next_index);
                    break;
                /* if nothing matches and reaches to last index then set active active to last nav item. */
                }else if ($(window).scrollTop() > mid_points[last_index]) {
                    add_and_remove_active_class(mid_points.length);
                /* remove from all if its rolled back to the top*/    
                }else {
                    $('.bottom-nav ul li').removeClass('active');
                }
            }
        });
    };

    var elementBeneathLogo;
    var initGlobalScrollActions = function() {

        var allScenes = [];

        $('.homepage .panel').each(function () {
            var element = $(this);
            
            new ScrollMagic.Scene({triggerElement: element})
                        .setPin(element)
                        .setClassToggle(element,'active')
                        .addTo(scrollController)
        });

        $('.services .panel').each(function (index) {
            var scene;
            var element = $(this);

            if($(this).hasClass('main')) {
                scene = new ScrollMagic.Scene({triggerElement: element})
                    .setPin(element)
                    .setClassToggle(element,'active')
                    .addTo(scrollController)
            }
            else { 
                scene = new ScrollMagic.Scene({triggerElement: element})
                            .setPin(element)
                            .setClassToggle($('.bottom-nav'),'fixed')
                            .setClassToggle(element,'active')
                            .addTo(scrollController)
            }


            allScenes.push({
                id: element.attr('id'),
                scene: scene
            });
        });

        handleServicesNav(allScenes);  

        var scrollmagic = new ScrollMagic.Scene({
                triggerElement: 'body'
            })
            .on('update', function() {

                ColorResponsive.init({
                    target: '.app-bar',
                    threshold: 'rgb(200,200,200)'
                });

            })
            .addTo(scrollController);
    };

    var initPageUX = function() {

        if ($('body').hasClass('homepage')) {
            initHomepageCarousel();
        }

        if ($('body').hasClass('news-insights')) {
            var msnry = new Masonry( $('.news-insights .cards')[0], {
                // options...
                itemSelector: '.card',
                columnWidth: 300,
                isFitWidth: true,
                gutter: 30
            });
        }
    };

    var initBackGroundCheck = function() {
        BackgroundCheck.init({
          targets: '.navdrawer-container ul,.img-logo,.img-logo-black',
          images: '.slick-slide,.slide.section.panel'
        });

        $('.color-light').colourBrightness();
        $('.half:last-child').colourBrightness();

        var isBackGroundCheckDestroyed = false;

        $(window).scroll(function () {
                
            var active_scene = $('.active').last();

            if(active_scene.hasClass('light') || active_scene.has('.light').length > 0 || active_scene.hasClass('dark') || active_scene.has('.dark').length > 0) {
                
                if(!isBackGroundCheckDestroyed) {
                    BackgroundCheck.destroy();
                    isBackGroundCheckDestroyed = true;
                }

                if(active_scene.hasClass('light') || active_scene.has('.light').length > 0) {
                    $('.navdrawer-container ul').removeClass('background--dark').addClass('background--light');
                    $('.img-logo-black').addClass('background--light');
                }
                else if(active_scene.hasClass('dark') || active_scene.has('.dark').length > 0){
                    $('.navdrawer-container ul').removeClass('background--light').addClass('background--dark');
                }
            }
            else {
                isBackGroundCheckDestroyed = false;
                BackgroundCheck.init({
                    targets: '.navdrawer-container ul,.img-logo,.img-logo-black',
                    images: '.slick-slide,.slide.section.panel'
                });
            }
        })
    };


    var handleWindowResize = function() {
        var $window = $(window);

        fitHeight($window.height());        // call once

        $window.resize(function() {
            fitHeight($window.height());    // call on resize

        });

    };

    var init = function() {
        initNav();
        initGlobalScrollActions();
        initBackGroundCheck();
        initPageUX();
        handleWindowResize();
    };

    return {
        init: init
    }
}());

HLG_UX.init();


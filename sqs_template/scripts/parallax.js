$(function () {    
    var controller = new ScrollMagic.Controller({
        globalSceneOptions: {
            triggerHook: 'onLeave',
            reverse: true
        }
    });

    // $('.homepage .panel').each(function () {
    //     var element = $(this);
    //     console.log(element);
        
    //     new ScrollMagic.Scene({triggerElement: element})
    //                 .setPin(element)
    //                 .setClassToggle(element,'active')
    //                 .addTo(controller)
    // })

    // var actual_positions = [0];    
    // var mid_points = [];  
    // var all_scenes = [];    

    // $('.services .panel').each(function (index) {
    //     if($(this).hasClass('main')) {
    //         new ScrollMagic.Scene({triggerElement: '.services .main'})
    //             .setPin('.services .main')
    //             .setClassToggle('.services .main','active')
    //             .addTo(controller)
    //     }
    //     else {
    //         var element_id = $(this).attr('id');
    //         var element_id_with_hash = '#' + $(this).attr('id');

    //         var scene = new ScrollMagic.Scene({triggerElement: element_id_with_hash})
    //                     .setPin(element_id_with_hash)
    //                     .setClassToggle(element_id_with_hash,'show-bottom-nav')
    //                     .addTo(controller)

    //         all_scenes.push({
    //             id: element_id,
    //             scene: scene
    //         });

    //         actual_positions.push(Math.ceil(scene.triggerPosition()));

    //         if(actual_positions.length > 1) {
    //             mid_points.push((actual_positions[index] + actual_positions [index-1]) / 2)
    //         }
    //     }
    // })


    // $('a[href*=#]:not([href=#])').click(function () {
    //     var id = $(this).attr('href').replace('#','');
    
    //     if($(this).parent().parent().parent().hasClass('bottom-nav')) {
    //         var index = $('.bottom-nav ul li a').index($(this));
    //     }else {
    //         var index = $('ul.wrap li a').index($(this));
    //     }

    //     if(id == 'down') {
    //         setTimeout(function () {
    //             $('.bottom-nav').addClass('fixed')
    //         },1100)
    //     }
    //     else {
    //         var targetted_scene = all_scenes[index];
    //         if(targetted_scene.id == id) {
    //             $('html,body').animate({scrollTop: targetted_scene.scene.scrollOffset()},1000);
    //             return false; 
    //         }
    //     }
    // })

    // var add_and_remove_active_class = function (index) {
    //     $('.bottom-nav').addClass('fixed')
    //     $('.bottom-nav ul li').removeClass('active');
    //     $('.bottom-nav ul li:nth-child(' + index + ')').children('a').parent().last().addClass('active');    
    // }

    // $(window).scroll(function () {
    //     if ($(".show-bottom-nav")[0]){
    //         $('.bottom-nav').addClass('fixed')
    //     }else{
    //         $('.bottom-nav').removeClass('fixed')
    //     }

    //     for(var index=0; index<mid_points.length; index++) {

    //         var next_index = index+1;
    //         var last_index = mid_points.length-1

    //         /* check between mid point ranges and set active class to the respective nav item. */
    //         if($(window).scrollTop() > mid_points[index] && $(window).scrollTop() < mid_points[next_index]) {
    //             add_and_remove_active_class(next_index);
    //             break;
    //         /* if nothing matches and reaches to last index then set active active to last nav item. */
    //         }else if ($(window).scrollTop() > mid_points[last_index]) {
    //             add_and_remove_active_class(mid_points.length);
    //         /* remove from all if its rolled back to the top*/    
    //         }else {
    //             $('.bottom-nav ul li').removeClass('active');
    //         }
    //     }
    // });
});

//change navigation color on scroll
/*
    var offset_top_news_section = $('.color-light').offset().top;
    var offset_top_contact_section = $('.pattern').offset().top;
    console.log(offset_top_contact_section, offset_top_news_section);

    $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();
        console.log(scroll);
        if(scroll < offset_top_contact_section && scroll >= offset_top_news_section) {
          $('.homepage nav').addClass('change-color');
        } else {
          $('.homepage nav').removeClass('change-color');
        }
    });
*/
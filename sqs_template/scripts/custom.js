// $(function() {
// 	BackgroundCheck.init({
// 	  targets: '.navdrawer-container ul',
// 	  images: '.slick-slide,.slide.section.panel'
// 	});

// 	$('.color-light').colourBrightness();
// 	$('.half:last-child').colourBrightness();

// 	var isBackGroundDestroyed = false;

// 	$(window).scroll(function () {
// 		var active_scene = $('.active').last();
// 		var element;
// 		if(active_scene.hasClass('dark-or-light')){
// 			element = active_scene;
// 		}else{
// 			element = active_scene.find('.dark-or-light');
// 		}

// 		if(element.hasClass('light')) {
// 			if(!isBackGroundDestroyed) {
// 				BackgroundCheck.destroy();
// 				isBackGroundDestroyed = true;
// 			}
// 			$('.navdrawer-container ul').removeClass('background--dark').addClass('background--light');
// 		}
// 		else if(element.hasClass('dark')) {
// 			if(!isBackGroundDestroyed) {
// 				BackgroundCheck.destroy();
// 				isBackGroundDestroyed = true;
// 			}
// 			$('.navdrawer-container ul').removeClass('background--light').addClass('background--dark');
// 		}else {
// 			isBackGroundDestroyed = false;
// 			BackgroundCheck.init({
// 	  			targets: '.navdrawer-container ul',
// 	  			images: '.slick-slide,.slide.section.panel'
// 			});
// 		}
// 	})
// });

// $(window).scroll(function () {
//     var active_scene = $('.active').last();
//     var element;
//     if(active_scene.hasClass('dark-or-light')){
//         element = active_scene;
//     }else{
//         element = active_scene.find('.dark-or-light');
//     }

//     if(element.hasClass('light')) {
//         if(!isBackGroundDestroyed) {
//             BackgroundCheck.destroy();
//             isBackGroundDestroyed = true;
//         }
//         $('.navdrawer-container ul').removeClass('background--dark').addClass('background--light');
//     }
//     else if(element.hasClass('dark')) {
//         if(!isBackGroundDestroyed) {
//             BackgroundCheck.destroy();
//             isBackGroundDestroyed = true;
//         }
//         $('.navdrawer-container ul').removeClass('background--light').addClass('background--dark');
//     }else {
//         isBackGroundDestroyed = false;
//         BackgroundCheck.init({
//             targets: '.navdrawer-container ul',
//             images: '.slick-slide,.slide.section.panel'
//         });
//     }
// })

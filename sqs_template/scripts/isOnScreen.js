// $.fn.isOnScreen = function(){
    
//     var win = $(window);
    
//     var viewport = {
//         top : win.scrollTop(),
//         left : win.scrollLeft()
//     };
//     viewport.right = viewport.left + win.width();
//     viewport.bottom = viewport.top + win.height();
    
//     var bounds = this.offset();
//     bounds.right = bounds.left + this.outerWidth();
//     bounds.bottom = bounds.top + this.outerHeight();
    
//     return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    
// };
/**
 * author Remy Sharp
 * url http://remysharp.com/2009/01/26/element-in-view-event-plugin/
 */
// (function ($) {
//     function getViewportHeight() {
//         var height = window.innerHeight; // Safari, Opera
//         var mode = document.compatMode;

//         if ( (mode || !$.support.boxModel) ) { // IE, Gecko
//             height = (mode == 'CSS1Compat') ?
//             document.documentElement.clientHeight : // Standards
//             document.body.clientHeight; // Quirks
//         }

//         return height;
//     }

//     $(window).scroll(function () {
//         var vpH = getViewportHeight(),
//             scrolltop = (document.documentElement.scrollTop ?
//                 document.documentElement.scrollTop :
//                 document.body.scrollTop),
//             elems = [];
        
//         // naughty, but this is how it knows which elements to check for
//         $.each($.cache, function () {
//             if (this.events && this.events.inview) {
//                 elems.push(this.handle.elem);
//             }
//         });

//         if (elems.length) {
//             $(elems).each(function () {
//                 var $el = $(this),
//                     top = $el.offset().top,
//                     height = $el.height(),
//                     inview = $el.data('inview') || false;

//                 if (scrolltop > (top + height) || scrolltop + vpH < top) {
//                     if (inview) {
//                         $el.data('inview', false);
//                         $el.trigger('inview', [ false ]);                        
//                     }
//                 } else if (scrolltop < (top + height)) {
//                     if (!inview) {
//                         $el.data('inview', true);
//                         $el.trigger('inview', [ true ]);
//                     }
//                 }
//             });
//         }
//     });
    
//     // kick the event to pick up any elements already in view.
//     // note however, this only works if the plugin is included after the elements are bound to 'inview'
//     $(function () {
//         $(window).scroll();
//     });
// })(jQuery);
(function($){

    /**
     * Copyright 2012, Digital Fusion
     * Licensed under the MIT license.
     * http://teamdf.com/jquery-plugins/license/
     *
     * @author Sam Sehnert
     * @desc A small plugin that checks whether elements are within
     *       the user visible viewport of a web browser.
     *       only accounts for vertical position, not horizontal.
     */
    var $w = $(window);
    $.fn.visible = function(partial,hidden,direction){

        if (this.length < 1)
            return;

        var $t        = this.length > 1 ? this.eq(0) : this,
            t         = $t.get(0),
            vpWidth   = $w.width(),
            vpHeight  = $w.height(),
            direction = (direction) ? direction : 'both',
            clientSize = hidden === true ? t.offsetWidth * t.offsetHeight : true;

        if (typeof t.getBoundingClientRect === 'function'){

            // Use this native browser method, if available.
            var rec = t.getBoundingClientRect(),
                tViz = rec.top    >= 0 && rec.top    <  vpHeight,
                bViz = rec.bottom >  0 && rec.bottom <= vpHeight,
                lViz = rec.left   >= 0 && rec.left   <  vpWidth,
                rViz = rec.right  >  0 && rec.right  <= vpWidth,
                vVisible   = partial ? tViz || bViz : tViz && bViz,
                hVisible   = partial ? lViz || rViz : lViz && rViz;

            if(direction === 'both')
                return clientSize && vVisible && hVisible;
            else if(direction === 'vertical')
                return clientSize && vVisible;
            else if(direction === 'horizontal')
                return clientSize && hVisible;
        } else {

            var viewTop         = $w.scrollTop(),
                viewBottom      = viewTop + vpHeight,
                viewLeft        = $w.scrollLeft(),
                viewRight       = viewLeft + vpWidth,
                offset          = $t.offset(),
                _top            = offset.top,
                _bottom         = _top + $t.height(),
                _left           = offset.left,
                _right          = _left + $t.width(),
                compareTop      = partial === true ? _bottom : _top,
                compareBottom   = partial === true ? _top : _bottom,
                compareLeft     = partial === true ? _right : _left,
                compareRight    = partial === true ? _left : _right;

            if(direction === 'both')
                return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop)) && ((compareRight <= viewRight) && (compareLeft >= viewLeft));
            else if(direction === 'vertical')
                return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop));
            else if(direction === 'horizontal')
                return !!clientSize && ((compareRight <= viewRight) && (compareLeft >= viewLeft));
        }
    };

})(jQuery);
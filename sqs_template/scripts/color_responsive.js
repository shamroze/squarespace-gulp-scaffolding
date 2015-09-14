(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.ColorResponsive = factory(root);
    }

}(this, function () {

    'use strict';

    var options;
    var canvas;
    var context;
    var backgroundElement;
    var hasImage = true;


    function getBackground(selector) {
        var background;

        // backgroundElement = document.elementFromPoint($(selector).position().left, $(selector).height()+1);

        // console.log(backgroundElement);
        var backgroundImage = $(selector).css('backgroundImage');
        var backgroundSize = $(selector).css('backgroundSize');

        if (backgroundImage == 'none') {

            var backgroundColor = $(selector).css('backgroundColor');

            background = backgroundColor.split('(')[1].split(')')[0].replace(/ /g, '');

            hasImage = false;

        } else {

            background = backgroundImage.replace('url(', '').replace(')', '');

        }

        return background;
    }

    function checkColorThreshold(color) {
        var rgbThresholdValues = /[0-9].*[0-9]/.exec(options.threshold)[0].split(',');
        var rgbBackgroundValues = color.split(',');

        if (rgbBackgroundValues[0] > rgbThresholdValues[0] && rgbBackgroundValues[1] > rgbThresholdValues[1] && rgbBackgroundValues[2] > rgbThresholdValues[2]) {
            $('.app-bar').addClass('background--light');
            $('.app-bar').removeClass('background--dark');
        } else {
            $('.app-bar').addClass('background--dark');
            $('.app-bar').removeClass('background--light');
        }
    }

    /*
     * Process px and %, discard anything else
     */
    function getValue(css, parent, delta) {
        var value;
        var percentage;

        if (css.indexOf('px') !== -1) {
            value = parseFloat(css);
        } else if (css.indexOf('%') !== -1) {
            value = parseFloat(css);
            percentage = value / 100;
            value = percentage * parent;

            if (delta) {
                value -= delta * percentage;
            }
        } else {
            value = parent;
        }

        return value;
    }


     /*
     * Calculate top, left, width and height
     * using the object's CSS
     */
    function calculateAreaFromCSS(obj) {
        var css = window.getComputedStyle(obj.el);

        // Force no-repeat and padding-box
        obj.el.style.backgroundRepeat = 'no-repeat';
        obj.el.style.backgroundOrigin = 'padding-box';

        // Background Size
        var size = css.backgroundSize.split(' ');
        var width = size[0];
        var height = size[1] === undefined ? 'auto' : size[1];

        var parentRatio = obj.el.clientWidth / obj.el.clientHeight;
        var imgRatio = obj.img.naturalWidth / obj.img.naturalHeight;

        if (width === 'cover') {

            if (parentRatio >= imgRatio) {
                width = '100%';
                height = 'auto';
            } else {
                width = 'auto';
                size[0] = 'auto';
                height = '100%';
            }

        } else if (width === 'contain') {

            if (1 / parentRatio < 1 / imgRatio) {
                width = 'auto';
                size[0] = 'auto';
                height = '100%';
            } else {
                width = '100%';
                height = 'auto';
            }
        }

        if (width === 'auto') {
            width = obj.img.naturalWidth;
        } else {
            width = getValue(width, obj.el.clientWidth);
        }

        if (height === 'auto') {
            height = (width / obj.img.naturalWidth) * obj.img.naturalHeight;
        } else {
            height = getValue(height, obj.el.clientHeight);
        }

        if (size[0] === 'auto' && size[1] !== 'auto') {
            width = (height / obj.img.naturalHeight) * obj.img.naturalWidth;
        }

        var position = css.backgroundPosition;

        // Fix inconsistencies between browsers
        if (position === 'top') {
            position = '50% 0%';
        } else if (position === 'left') {
            position = '0% 50%';
        } else if (position === 'right') {
            position = '100% 50%';
        } else if (position === 'bottom') {
            position = '50% 100%';
        } else if (position === 'center') {
            position = '50% 50%';
        }

        position = position.split(' ');

        var x;
        var y;

        // Two-value syntax vs Four-value syntax
        if (position.length === 4) {
            x = position[1];
            y = position[3];
        } else {
            x = position[0];
            y = position[1];
        }

        // Use a default value
        y = y || '50%';

        // Background Position
        x = getValue(x, obj.el.clientWidth, width);
        y = getValue(y, obj.el.clientHeight, height);

        // Take care of ex: background-position: right 20px bottom 20px;
        if (position.length === 4) {

            if (position[0] === 'right') {
                x = obj.el.clientWidth - obj.img.naturalWidth - x;
            }

            if (position[2] === 'bottom') {
                y = obj.el.clientHeight - obj.img.naturalHeight - y;
            }
        }

        x += obj.el.getBoundingClientRect().left;
        y += obj.el.getBoundingClientRect().top;

        return {
            left: Math.floor(x),
            right: Math.floor(x + width),
            top: Math.floor(y),
            bottom: Math.floor(y + height),
            width: Math.floor(width),
            height: Math.floor(height)
        };
    }

    /*
     * Get Bounding Client Rect
     */
    function getArea(obj) {
        var area;
        var image;
        var parent;

        if (obj.nodeType) {
            var rect = obj.getBoundingClientRect();

            // Clone ClientRect for modification purposes
            area = {
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom,
                width: rect.width,
                height: rect.height
            };

            parent = obj.parentNode;
            image = obj;
        } else {
            area = calculateAreaFromCSS(obj);
            parent = obj.el;
            image = obj.img;
        }

        parent = parent.getBoundingClientRect();

        area.imageTop = 0;
        area.imageLeft = 0;
        area.imageWidth = image.naturalWidth;
        area.imageHeight = image.naturalHeight;

        var ratio = area.imageHeight / area.height;
        var delta;

        // Stay within the parent's boundary
        if (area.top < parent.top) {
            delta = parent.top - area.top;
            area.imageTop = ratio * delta;
            area.imageHeight -= ratio * delta;
            area.top += delta;
            area.height -= delta;
        }

        if (area.left < parent.left) {
            delta = parent.left - area.left;
            area.imageLeft += ratio * delta;
            area.imageWidth -= ratio * delta;
            area.width -= delta;
            area.left += delta;
        }

        if (area.bottom > parent.bottom) {
            delta = area.bottom - parent.bottom;
            area.imageHeight -= ratio * delta;
            area.height -= delta;
        }

        if (area.right > parent.right) {
            delta = area.right - parent.right;
            area.imageWidth -= ratio * delta;
            area.width -= delta;
        }

        area.imageTop = Math.floor(area.imageTop);
        area.imageLeft = Math.floor(area.imageLeft);
        area.imageHeight = Math.floor(area.imageHeight);
        area.imageWidth = Math.floor(area.imageWidth);

        return area;
    }

    function drawImage(backgroundUrl) {
        var image = new Image();

        image.src = backgroundUrl;

        canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0px';
        canvas.style.left = '0px';
        canvas.width = document.body.clientWidth;
        canvas.height = window.innerHeight;


        context = canvas.getContext('2d');

        console.log(image)
        var area = getArea(image);
        image = image.nodeType ? image : image.img;

        if (area.imageWidth > 0 && area.imageHeight > 0 && area.width > 0 && area.height > 0) {
            context.drawImage(image,
                area.imageLeft, area.imageTop, area.imageWidth, area.imageHeight,
                area.left, area.top, area.width, area.height);
        } else {
            log('Skipping image - ' + image.src + ' - area too small');
        }
    }

    function checkBackground(background) {
        if (hasImage) {
            $(options.target)
            // console.log($(options.target))
            drawImage(background);
        } else {
            checkColorThreshold(background);
        }
    }

    function init(_options) {

        options = _options;


        if (options.target === undefined || options.threshold === undefined ) {
            throw('Missing target and threshold options')
        }

        var background = getBackground(options.target);

        if (background == $(options.target).data('background')) {
            return;
        } else {
            $(options.target).data('background', background);
            console.log($(options.target).data('background'))

            checkBackground(background);
        }
    }

    return {
        /*
         * Init and destroy
         */
        init: init,
        //destroy: destroy,
        //
        ///*
        // * Expose main function
        // */
        //refresh: check,
        //
        ///*
        // * Setters and getters
        // */
        //set: set,
        //get: get,
        //
        ///*
        // * Return image data
        // */
        //getImageData: getImageData
    };

}));
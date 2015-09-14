/**
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp');
var jade = require('gulp-jade');
var rename = require('gulp-rename');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

gulp.task('jade', function() {

    return gulp.src('app/jade/**/*.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('.tmp'))
        .pipe(gulp.dest('dist'));
});

gulp.task('blocks', function() {

    return gulp.src('app/blocks/**/*.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(rename(function (path) {
            path.extname = ".region"
        }))
        .pipe(gulp.dest("./sqs_template/blocks"));
});

// Lint JavaScript
gulp.task('jshint', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe(reload({stream: true, once: true}))
        .pipe($.jshint({unused:false}))
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize images
gulp.task('images', function () {
    return gulp.src('app/assets/images/**')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/assets/images'))
        .pipe($.size({title: 'images'}));
});

// Copy all files at the root level (app)
gulp.task('copy', function () {
    return gulp.src([
        'app/assets',
        '!app/*.html',
        '!app/**/*.scss',
        'node_modules/apache-server-configs/dist/.htaccess'
    ], {
        dot: true
    }).pipe(gulp.dest('sqs_template'))
        .pipe($.size({title: 'copy'}));
});

// Copy web fonts to dist
gulp.task('fonts', function () {
    return gulp.src(['app/fonts/**'])
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size({title: 'fonts'}));
});

// Compile and automatically prefix stylesheets
gulp.task('styles', function () {
    // For best performance, don't add Sass partials to `gulp.src`
    return gulp.src([
        'app/assets/styles/**.scss',
        'app/assets/styles/**/*.css',
        'app/assets/styles/components/components.scss'
    ])
        .pipe($.sourcemaps.init())
        .pipe($.changed('.tmp/assets/styles', {extension: '.css'}))
        .pipe($.sass({
            noCache: true,
            precision: 10,
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/assets/styles'))
        // Concatenate and minify styles for squarespace
        //.pipe($.if('*.css', $.csso()))
        .pipe(gulp.dest('sqs_template/assets/styles'))
        .pipe($.size({title: 'styles'}));
});

// Scan your HTML for assets & optimize them
gulp.task('html', function () {
    var assets = $.useref.assets({searchPath: '{.tmp,app}'});

    return gulp.src('app/**/*.html')
        .pipe(assets)
        // Concatenate and minify JavaScript
        .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
        // Remove any unused CSS
        // Note: if not using the Style Guide, you can delete it from
        //       the next line to only include styles your project uses.
        .pipe($.if('*.css', $.uncss({
            html: [
                'app/index.html',
                'app/styleguide.html'
            ],
            // CSS Selectors for UnCSS to ignore
            ignore: [
                /.navdrawer-container.open/,
                /.app-bar.open/
            ]
        })))
        // Concatenate and minify styles
        // In case you are still using useref build blocks
        .pipe($.if('*.css', $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())
        // Update production Style Guide paths
        .pipe($.replace('components/components.css', 'components/main.min.css'))
        // Minify any HTML
        .pipe($.if('*.html', $.minifyHtml()))
        // Output files
        .pipe(gulp.dest('dist'))
        .pipe($.size({title: 'html'}));
});

// Clean output directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

gulp.task('cleanCss', del.bind(null, ['.tmp/assets/styles', 'dist/assets/styles'], {dot: true}));

// Watch files for changes & reload
gulp.task('serve', ['styles', 'jade'], function () {

    browserSync({
        notify: true,
        // Customize the BrowserSync console logging prefix
        logPrefix: 'WSK',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: ['.tmp', 'app']
    });

    gulp.watch(['app/jade/**/*.jade'], ['jade', reload]);
    gulp.watch(['app/blocks/**/*.jade'], ['blocks', reload]);
    gulp.watch(['app/assets/styles/**/*.{scss,css}'], ['cleanCss', 'styles', reload]);
    gulp.watch(['app/scripts/**/*.js'], ['sqs_copy_js'], reload);
    gulp.watch(['app/assets/images/**/*'], ['sqs_copy_images'], reload);
    gulp.watch(['app/template.conf'], ['sqs_copy_conf'], reload);
});

// Copy all assets for squarespace
gulp.task('sqs_copy_images', function () {
    return gulp.src([
        'app/assets/images/**',
    ], {
        dot: true
    }).pipe(gulp.dest('sqs_template/assets/images'))
        .pipe($.size({title: 'copy'}));
});

gulp.task('sqs_copy_conf', function () {
    return gulp.src([
        'app/template.conf',
    ], {
        dot: true
    }).pipe(gulp.dest('sqs_template/'))
        .pipe($.size({title: 'copy'}));
});

gulp.task('sqs_copy_js', function () {
    return gulp.src([
        'app/scripts/**',
    ], {
        dot: true
    }).pipe(gulp.dest('sqs_template/scripts'))
        .pipe($.size({title: 'copy'}));
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
    browserSync({
        notify: false,
        logPrefix: 'WSK',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: 'dist'
    });
});

// Build squarespace files
gulp.task('sqs', ['clean'], function (cb) {
    runSequence('jade', 'blocks', 'styles', ['sqs_copy_js', 'html', 'images', 'fonts', 'sqs_copy_images'], cb);
});

// Build production files, the default task
gulp.task('default', ['clean'], function (cb) {
    runSequence('jade', 'styles', ['jshint', 'html', 'images', 'fonts', 'copy'], cb);
});

// Run PageSpeed Insights
gulp.task('pagespeed', function (cb) {
    // Update the below URL to the public URL of your site
    pagespeed.output('example.com', {
        strategy: 'mobile',
        // By default we use the PageSpeed Insights free (no API key) tier.
        // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
        // key: 'YOUR_API_KEY'
    }, cb);
});

// Load custom tasks from the `tasks` directory
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }

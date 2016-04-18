/*jslint node: true */
"use strict";

/*
*
*
* Paths
* if extra paths are needed for the project, add them here.
*
*/
var paths = {
    scripts: {
        input: 'app/dev/assets/js/**/*.js',
        output: 'app/public/js'
    },
    styles: {
        input: 'app/dev/assets/styles/**/*.{scss,sass}',
        output: 'app/public/css',
				vendors: 'app/dev/assets/styles/vendor/*'
    },
    html: {
        input: 'app/dev/**/*.html',
        output: 'app/public/'
    },
    images: {
        input: 'app/dev/assets/images/**/*',
        output: 'app/public/images'
    },
    extras: {
        input: ['app/dev/extras/*'],
        output: 'app/public/'
    }
};

/*
*
*
* Plugins
*
*
*/

//General Plugins
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var flatten = require('gulp-flatten');

//Html Plugins
var htmlmin = require('gulp-htmlmin');

//Sass plugins
var sass = require('gulp-sass');
var minifycss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var bourbon = require('node-bourbon').includePaths;
var neat = require('node-neat').includePaths;

//Image Plugins
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

//Javascript Plugins
var uglify = require('gulp-uglify');

//Browsersync
var browserSync = require("browser-sync").create();

//Linters
var scssLint = require("gulp-scss-lint");
var eslint = require('gulp-eslint');





/*
*
* CLEAN
* Removes the dist directory -
* cleans out all files that may no longer exist in dev
*/
gulp.task('clean', function () {
    return gulp.src('public/', {read: false})
        .pipe(clean());
});

/*
*
* MOVE FILES
*
*/
//Master move task
gulp.task('move', ['move-extras']);

//Extra files - robot.txt, etc
gulp.task('move-extras', function () {
    return gulp.src(paths.extras.input)
        .pipe(gulp.dest(paths.extras.output));
});

/*
*
* HTML
* Minifies html
*/
gulp.task('html', function () {
    return gulp.src(paths.html.input)
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest(paths.html.output));
});

/*
*
* SCSS
*
*/

// LINTER

gulp.task('scsslint', function () {
	gulp.src([paths.styles.input, paths.styles.vendors])
	  .pipe(scsslint());
});

gulp.task('scss', ['scsslint'], function () {
    return gulp.src(paths.styles.input)
        .pipe(sass({
            includePaths: [].concat(bourbon, neat)
        }))
        .pipe(autoprefixer())
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.styles.output))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/*
*
* IMAGES
*
*/
gulp.task('imagemin', function () {
    return gulp.src(paths.images.input)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(paths.images.output));
});

/*
*
* JAVASCRIPT
*
*/

// LINTER
gulp.task('eslint', function () {
	return gulp.src(paths.scripts.input)
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());
});

gulp.task('js', ['eslint'], function () {
    return gulp.src(paths.scripts.input)
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.output));
});

/*
*
* BROWSERSYNC AND RELOAD
*
*/
gulp.task('browser-sync', function () {
    browserSync.init({});
});

gulp.task('browser-sync-reload', function () {
    browserSync.reload();
});

/*
*
* WATCH
*
*/
gulp.task('watch', function () {

    //Watch HTML files
    gulp.watch(paths.html.input, ['html', 'browser-sync-reload']);

    //Watch Sass files
    gulp.watch(paths.styles.input, ['scss']);

    //Watch JS files
    gulp.watch(paths.scripts.input, ['js']);

});

//Default Task. -
//Add all the tasks you would like to run on startup of the container here.
gulp.task('default', ['move', 'browser-sync', 'scss', 'imagemin', 'js', 'watch']);

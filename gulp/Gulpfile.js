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
		lint: ['app/dev/assets/styles/**/*.{scss,sass}, !app/dev/assets/style/vendor/**/*.{scss,sass}']
    },
    html: {
        input: 'app/dev/**/*.html',
        output: 'app/public/',
		partials: 'app/dev/partials',
		prodPartials: ['app/dev/partials, !app/dev/partials/bs.hbs'],
		hbs: 'app/dev/**/*.{html,hbs}'
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
var handlebars = require('gulp-compile-handlebars');
var sitemap = require('gulp-sitemap');
var htmlbuild = require('gulp-htmlbuild');

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
var scsslint = require("gulp-scss-lint");
var eslint = require('gulp-eslint');

//Error Notifying
var notify = require('gulp-notify');

//Plumber Error Handling
var plumber = require('gulp-plumber');

function customPlumber() {
  return plumber({
      // Next line is used for gulp-no
      //errorHandler: notify.onError("Error: <%= error.message %>"),
      errorHandler: function(err) {
          console.log(err.stack);
          browserSync.notify(err.stack, 150000);
          this.emit('end');
      }

/*
    errorHandler: function(err) {
      console.log(err.stack);
      this.emit('end');
    }
    */
  });
}

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
        .pipe(customPlumber('Error with HTML minifying'))
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest(paths.html.output));
});

/* Task to build sitemap.*/
gulp.task('sitemap', function () {
    gulp.src(paths.html.input)
        .pipe(customPlumber('Error building sitemap'))
        .pipe(sitemap({
            siteUrl: 'https://zzrot.com'
        }))
        .pipe(gulp.dest(paths.extras.output));
});

/* Task to edit html - currently removes*/
gulp.task('htmlbuild', function () {
    return gulp.src(paths.html.input)
        .pipe(customPlumber('Error with htmlbuild'))
        .pipe(htmlbuild({
            bs: function (block) {
                block.end();
            }
        }))
        .pipe(gulp.dest(paths.html.output));
});



//HANDLEBARS
gulp.task('handlebars', function () {

  try {
  	var templateData = {
  	    },
  	options = {
  		ignorePartials: true,
  		batch : paths.html.partials
  	}
  }
  catch(err) {
    return gulp.src(paths.html.input)
      .pipe(customPlumber('Error with Handlebar'));
  }
	return gulp.src(paths.html.input)
    .pipe(customPlumber('Error with Handlebar'))
		.pipe(handlebars(templateData, options))
		.pipe(gulp.dest(paths.html.output));
});

//Handle bars task without browserSync partial
gulp.task('handlebarsProd', function () {
  try {
  	var templateData = {
  	    },
  	options = {
  		ignorePartials: true,
  		batch : paths.html.prodPartials
  	}
  }
  catch(err) {
    return gulp.src(paths.html.input)
      .pipe(customPlumber('Error with handlebars'));
  }
	return gulp.src(paths.html.input)
    .pipe(customPlumber('Error with handlebars'))
		.pipe(handlebars(templateData, options))
		.pipe(gulp.dest(paths.html.output));
});

/*
*
* SCSS
*
*/

// LINTER

gulp.task('scsslint', function () {
	gulp.src(paths.styles.lint)
    .pipe(customPlumber("SCSS Linter error"))
	  .pipe(scsslint());
});

gulp.task('scss', ['scsslint'], function () {
    return gulp.src(paths.styles.input)
        .pipe(customPlumber('SCSS linter error'))
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
        .pipe(customPlumber())
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
    gulp.watch(paths.html.hbs, ['handlebars', 'browser-sync-reload']);

    //Watch Sass files
    gulp.watch(paths.styles.input, ['scss']);

    //Watch JS files
    gulp.watch(paths.scripts.input, ['js', 'browser-sync-reload']);

    //Watch Images
    gulp.watch(paths.images.input, ['imagemin', 'browser-sync-reload']);

	gulp.watch(paths.extras.input, ['move']);

});


//Default Task. - Clean, then recompile every asset on startup, then start watch
gulp.task('default', ['handlebars', 'move', 'browser-sync', 'scss', 'imagemin', 'js', 'watch', 'sitemap']);

gulp.task('production', ['handlebarsProd', 'sitemap', 'move', 'scss', 'imagemin', 'js']);

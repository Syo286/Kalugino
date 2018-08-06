
/*!
 *  Gulpfile
 */


// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    bs = require('browser-sync');


// Set sources folder structure
var
  // Sources folder
  src = 'app/assets',
  // Web URL
  url = 'http://www.example.com:9000',
  // Watch list for files
  wtc = [ 'public/**/*.html' ],
  // Destination for ready assets
  dst = 'public/assets';


// Clean destination assets before recompilation
gulp.task('clean', function() {
  return del([dst+'/css', dst+'/js', dst+'/images', dst+'/fonts', dst+'/../*.html']);
});


// Build vendor assets
gulp.task('vendor', function() {

  // Prepare vendor javascripts
  gulp.src(
    [
      //'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
      'node_modules/jquery.maskedinput/dist/jquery.maskedinput.min.js'
    ])
    .pipe(jshint())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(dst+'/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(dst+'/js'));

  // Prepare vendor stylesheets
  gulp.src(
    [
      'node_modules/animate.css/animate.min.css',
    ])
    .pipe(concatcss('vendor.css', {rebaseUrls: false}))
    .pipe(sourcemaps.init())
    .pipe(gulp.dest(dst+'/css'))
    .pipe(rename('vendor.min.css'))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dst+'/css'));

  // Prepare Bootstrap font
  gulp.src('node_modules/bootstrap-sass/assets/fonts/*/**')
    .pipe(gulp.dest(dst+'/fonts/'));

  // Prepare FontAwesome font
  gulp.src('node_modules/font-awesome/fonts/**')
    .pipe(gulp.dest(dst+'/fonts/fontawesome/'));

});


// Stylesheets compilation
gulp.task('stylesheets', function() {
  gulp.src(src+'/stylesheets/application.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed', sourcemap: true, indentedSyntax: false, errLogToConsole: true }))
    .pipe(gulp.dest(dst+'/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dst+'/css'))
    .pipe(bs.stream())
    .pipe(notify({ message: 'Stylesheets task completed' }));
});


// CoffeeScripts compilation
gulp.task('coffeescripts', function() {
  gulp.src([src+'/coffeescripts/**/*.coffee'])
    .pipe(coffee({bare: true}))
    .pipe(jshint())
    .pipe(concat('coffee.js'))
    .pipe(gulp.dest(dst+'/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(dst+'/js'))
    .pipe(bs.stream())
    .pipe(notify({ message: 'Coffeescripts task completed' }));
});


// JavaScripts compilation
gulp.task('javascripts', function() {
  gulp.src([src+'/javascripts/**/*.js'])
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(jshint())
    .pipe(concat('application.js'))
    .pipe(gulp.dest(dst+'/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(dst+'/js'))
    .pipe(bs.stream())
    .pipe(notify({ message: 'Javascripts task completed' }));
});


// HTML compilation
gulp.task('html', function () {
  gulp.src(src+'/../views/*.html')
    .pipe(html())
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest(dst+'/../'))
    .pipe(notify({ message: 'HTML task completed' }));
});


// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('vendor', 'stylesheets', 'javascripts', 'coffeescripts', 'images', 'html');
});


// Browser sync
gulp.task('browser-sync', ['stylesheets'], function() {
  bs.init({
    proxy: url
  });
});


// Enable watch feature
gulp.task('watch', ['browser-sync'], function() {

  // Watch for .scss files
  gulp.watch(src+'/stylesheets/**/*.scss', ['stylesheets']);

  // Watch for .coffee files
  gulp.watch(src+'/coffeescripts/**/*.coffee', ['coffeescripts']);

  // Watch for .js files
  gulp.watch(src+'/javascripts/**/*.js', ['javascripts']);

  // Watch image files
  gulp.watch(src+'/images/**/*', ['images']);

  // Watch sprites
  //gulp.watch(src+'/sprites/**/*.png', ['sprite']);

  // Watch HTML templates
  gulp.watch(src+'/../views/**/*.html', ['html']);

  // Watch any files specified in array, reload on change
  gulp.watch(wtc).on('change', bs.reload);

});

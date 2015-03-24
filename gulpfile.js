var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('build', ['css', 'js']);

var scriptOrder = [
  'src/scripts/maps/Maps.js',
  'src/scripts/maps/MapSearch.js',
  'src/scripts/maps/MapDirections.js',
  'src/scripts/utils/*.js',
  'src/scripts/angular/*.js',
  'src/scripts/angular/services/*.js',
  'src/scripts/angular/controllers/*.js'
];
gulp.task('js', function () {
   return gulp.src(scriptOrder)
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(concat('app.js'))
      .pipe(gulp.dest('./public/build/'));
});

gulp.task('css', function() {
  gulp.src('src/styles/compiled/*.css')
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./public/build/'))
});
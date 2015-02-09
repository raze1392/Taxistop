var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css');;

gulp.task('build', ['css', 'js']);

gulp.task('js', function () {
   return gulp.src('public/scripts/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(concat('app.js'))
      .pipe(gulp.dest('./public/build/'));
});

gulp.task('css', function() {
  gulp.src('public/stylesheets/*.css')
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest('./public/build/'))
});
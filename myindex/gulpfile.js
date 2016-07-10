var gulp = require('gulp'),
	sass = require('gulp-sass'),
	compass = require('gulp-compass');

gulp.task('sass',function () {
	gulp.src('sass/style.scss')
		.pipe(sass())
		.pipe(gulp.dest('stylesheets/'));
});

gulp.task('compass',function () {
	gulp.src('sass/*.scss')
		.pipe(compass())
		.pipe(gulp.dest('css/'));
});

gulp.task('default',['testsass']);
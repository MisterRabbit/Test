const gulp = require('gulp');
const buffer = require('vinyl-buffer');
const imagemin = require('gulp-imagemin');

let imgPATH = {
	"input": [
		'./src/assets/img/**/*.{png,jpg,jpeg,gif,svg,webp}',
		'!./src/assets/img/svg/*',
		'!./src/assets/img/favicons/*'
		],
	"ouput": "./build/assets/img/"
};

module.exports = function imageMinify() {
	return gulp.src(imgPATH.input)
	.pipe(buffer())
	.pipe(imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.mozjpeg({
			quality: 75,
			progressive: true
		}),
		imagemin.optipng({optimizationLevel: 5}),
		imagemin.svgo({
			plugins: [
				{removeViewBox: true},
				{cleanupIDs: false}
			]
		})
	]))
	.pipe(gulp.dest(imgPATH.ouput))
};
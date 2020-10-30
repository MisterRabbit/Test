const gulp = require ('gulp');

module.exports = fonts = () => {
	return gulp.src('src/assets/fonts/**/*.*')
		.pipe(gulp.dest('build/assets/fonts'))
}
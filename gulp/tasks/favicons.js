const gulp = require ('gulp');

module.exports = favicons = () => {
	return gulp.src('src/assets/img/favicons/**/*.*')
		.pipe(gulp.dest('build/assets/img/favicons'))
}
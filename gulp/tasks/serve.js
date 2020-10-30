const gulp = require('gulp');

const fonts = require('./fonts');
const favicons = require('./favicons');
const svg = require('./svg');
const pug2html = require('./pug');
const styles = require('./styles');
const scripts = require('./scripts');
const libsJS = require('./libsJS');
const images = require('./images')

const server = require('browser-sync').create();

module.exports = serve = (cb) => {
	server.init({
		server: 'build',
		notify: false,
		open: true,
		cors: true
	});
	gulp.watch('gulp/tasks/libsJS.js', gulp.series(libsJS)).on('change', server.reload);
	gulp.watch('src/assets/js/**/*.js', gulp.series(scripts)).on('change', server.reload);
	gulp.watch('src/assets/scss/**/*.scss', gulp.series(styles)).on('change', server.reload);
	gulp.watch('src/assets/img/{common,content}/**/*.{png,jpg,jpeg,gif,svg,webp}', gulp.series(images)).on('change', server.reload);
	gulp.watch('src/assets/img/svg/**/*.*', gulp.series(svg)).on('change', server.reload);
	gulp.watch('src/assets/fonts/**/*.*', gulp.series(fonts)).on('change', server.reload);
	gulp.watch('src/assets/img/favicons/**/*.*', gulp.series(favicons)).on('change', server.reload);
	gulp.watch('src/pug/**/*.pug', gulp.series(pug2html));
	gulp.watch('build/*.html').on('change', server.reload);

	return cb()
};
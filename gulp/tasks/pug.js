const gulp = require('gulp');

const pug = require('gulp-pug');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const argv = require('yargs').argv;
const gulpif = require('gulp-if');
const htmlValidator = require('gulp-w3c-html-validator');
const bemValidator = require('gulp-html-bem-validator');
const fs = require('fs');


module.exports = pug2html = () => {
	return gulp.src('src/pug/pages/*.pug')
		.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: "PUG",
					message: "<%= error.message %>"
				})(err);
			}
		}))
		.pipe(pug({
			locals: {
				content: JSON.parse(fs.readFileSync('./src/pug/data/content.json', 'utf8'))
			},
			pretty: true
		}))
		// .on("error", notify.onError())
		.pipe(plumber.stop())
		.pipe(gulpif(argv.prod, htmlValidator()))
		.pipe(gulpif(argv.prod, htmlValidator.reporter()))
		.pipe(gulpif(argv.prod, bemValidator()))
		.pipe(gulp.dest('build'))
};
const gulp = require('gulp');

const cssnano = require('gulp-cssnano');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const sortCSSmq = require('sort-css-media-queries'); // custom queries for css-mqpacker
const focus = require('postcss-focus'); // add :focus to element with :hover
const mqpacker = require('css-mqpacker');

const scss = require('gulp-sass');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const argv = require('yargs').argv;
const gulpif = require('gulp-if');

let postcssPlugins = [
	// mqpacker(), // Mobile first media queries
	mqpacker({ sort: sortCSSmq.desktopFirst }), // Desktop first media queries
	focus(),
	autoprefixer()
],
	filesPATH = {
		"input": "./src/assets/scss/main.scss",
		"output": "./build/assets/css/"
	};


module.exports = styles = () => {
	return gulp.src(filesPATH.input)
		.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: "SCSS",
					message: "<%= error.message %>"
				})(err);
			}
		}))
		.pipe(gulpif(!argv.prod, sourcemaps.init()))
		.pipe(scss())
		.pipe(postcss(postcssPlugins))
		.pipe(gulpif(argv.prod, cssnano()))
		.pipe(gulpif(!argv.prod, sourcemaps.write()))
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest(filesPATH.output))
};
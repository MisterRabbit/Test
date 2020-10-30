const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

let	libs = [
	'node_modules/nodelist-foreach-polyfill/index.js',
	// 'node_modules/es5-shim/es5-shim.min.js',
	// 'node_modules/es5-shim/es5-sham.min.js',
	'node_modules/svg4everybody/dist/svg4everybody.min.js'
];

module.exports = libsJS = (cb) => {
	return libs.length
		? gulp.src(libs)
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build/assets/js/'))
		: cb();
};
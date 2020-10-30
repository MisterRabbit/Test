const gulp = require('gulp');

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const argv = require('yargs').argv;
const gulpif = require('gulp-if');

let scriptsPATH = {
	"input": "./src/assets/js/main.js",
	"output": "./build/assets/js/"
};

module.exports = scripts = () => {
	return gulp.src(scriptsPATH.input)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(babel())
		.pipe(gulpif(argv.prod, uglify()))
		.pipe(rename('main.min.js'))
		.pipe(gulp.dest(scriptsPATH.output));
};

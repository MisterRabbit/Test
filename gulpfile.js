const gulp = require('gulp');

const clean = require('./gulp/tasks/clean');
const fonts = require('./gulp/tasks/fonts');
const favicons = require('./gulp/tasks/favicons');
const svg = require('./gulp/tasks/svg');
const pug2html = require('./gulp/tasks/pug');
const serve = require('./gulp/tasks/serve');
const styles = require('./gulp/tasks/styles');
const scripts = require('./gulp/tasks/scripts');
const libsJS = require('./gulp/tasks/libsJS');
const images = require('./gulp/tasks/images');


const dev = gulp.parallel(pug2html, styles, scripts, libsJS, fonts, svg, favicons, images);



exports.default = gulp.series(clean, dev, serve);



// TODO add gulp-real-favicon
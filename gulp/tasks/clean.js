const del = require('del');

module.exports = clean = (cb) => {
	return del('build').then(() => {
		cb()
	})
};
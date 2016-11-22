const co = require('co');
const del = require('del');
const fspp = require('../../src/fs-promise-proxy');

module.exports = co.wrap(function* (data, cfg/*, plop*/) {
	const removeFilePath = cfg.path;
	if (yield fspp.fileExists(removeFilePath)) {
		return yield del([removeFilePath]);
	} else {
		throw `Path does not exist ${removeFilePath}`;
	}
});

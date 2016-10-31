'use strict';

const pify = require('pify');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = (function () {
	const readFile = pify(fs.readFile);
	const writeFile = pify(fs.writeFile);
	const makeDir = pify(mkdirp);
	const readDir = pify(fs.readdir);
	const access = pify(fs.access);

	const getFile = path => readFile(path, 'utf8');
	const setFile = (path, data) => writeFile(path, data, 'utf8');
	const fileExists = path => access(path).then(() => true, () => false);

	return {
		readFile: getFile,
		writeFile: setFile,
		fileExists: fileExists,
		makeDir: makeDir
	};
})();

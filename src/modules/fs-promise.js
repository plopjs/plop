'use strict';

const denodeify = require('denodeify');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

module.exports = (function () {
	const readFile = denodeify(fs.readFile);
	const writeFile = denodeify(fs.writeFile);
	const makeDir = denodeify(mkdirp);
	const readDir = denodeify(fs.readdir);
	const stat = denodeify(fs.stat);

	// basic proxying functions
	const getFile = path => readFile(path, 'utf8');
	const setFile = (path, data) => writeFile(path, data, 'utf8');
	const fileExists = path => new Promise(resolve => fs.exists(path, resolve));

	return {
		readFile: getFile,
		writeFile: setFile,
		fileExists: fileExists,
		makeDir: makeDir
	};
})();

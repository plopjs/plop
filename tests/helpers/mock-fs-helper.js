// thanks very much to @enb
// https://github.com/enb/enb-stylus/blob/master/test/lib/mock-fs-helper.js

var fs = require('fs'),
path = require('path');

module.exports = {
	/**
	* Duplicate of the real file system for passed dir, used for mock fs for tests
	* @param {String} dir – filename of directory (full path to directory)
	* @returns {Object} - object with duplicating fs
	*/
	duplicateFSInMemory: function (dir) {
		var obj = {};

		fs.readdirSync(dir).forEach(function (basename) {
			var filename = path.join(dir, basename),
			stat = fs.statSync(filename);

			if (stat.isDirectory()) {
				process(obj, dir, basename);
			} else {
				obj[basename] = readFile(filename);
			}
		});

		return obj;
	},

	/**
	* 1. Remove all css comments, because they going to remove after @import stylus
	* 2. Remove all spaces and white lines
	* @param {String} contents - file contents
	* @returns {String}
	*/
	normalizeFile: function (contents) {
		return contents
		.replace(/(\r\n|\n|\r)/gm, '') // remove line breaks
		.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '') // spaces
		.trim();
	},

	readFile: readFile
};

/**
* Function to traverse the directory tree
* @param {Object} obj  - model of fs
* @param {String} root - root dirname
* @param {String} dir  - dirname
*/
function process(obj, root, dir) {
	var dirname = dir ? path.join(root, dir) : root,
	name = dir || root,
	additionObj = obj[name] = {};

	fs.readdirSync(dirname).forEach(function (basename) {
		var filename = path.join(dirname, basename),
		stat = fs.statSync(filename);

		if (stat.isDirectory()) {
			process(additionObj, dirname, basename);
		} else {
			additionObj[basename] = readFile(filename);
		}
	});
}

/**
* Helper for reading file.
* For text files calls a function to delete /r symbols
* @param {String} filename - filename
* @returns {*}
*/
function readFile(filename) {
	var ext = path.extname(filename);

	if (['.gif', '.png', '.jpg', '.jpeg', '.svg'].indexOf(ext) !== -1) {
		return fs.readFileSync(filename);
	}

	return fs.readFileSync(filename, 'utf-8');
}

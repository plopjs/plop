module.exports = (function () {
	'use strict';

	var q = require('q'),
		fs = require('fs'),
		mkdirp = require('mkdirp'),
		path = require('path');

	var readFile = q.denodeify(fs.readFile),
		writeFile = q.denodeify(fs.writeFile),
		readDir = q.denodeify(fs.readdir),
		makeDir = q.denodeify(mkdirp),
		stat = q.denodeify(fs.stat);


	function getFile(path) {
		return readFile(path, 'utf8');
	}

	function setFile(path, data) {
		return writeFile(path, data, 'utf8');
	}

	function getJson(path) {
		return getFile(path).then(function (data) {
			return JSON.parse(data);
		});
	}

	function setDir(dir) {
		return makeDir(dir).then(function () { return dir; });
	}

	function getFolderList(dir) {
		var _d = q.defer();

		readDir(dir).then(function (list) {
			list = list || [];
			var pending = list.length || 0,
				results = [];

			if (!pending) { _d.reject(new Error('Nothing to list: ' + dir)); }

			list.forEach(function(filePath) {
				var path = dir + '/' + filePath;
				stat(path).then(function(dstat) {
					if (dstat && dstat.isDirectory()) {
						results.push(filePath);
					}

					if (!--pending) { _d.resolve(results); }
				});
			});
		}, function () {
			_d.reject(new Error('Folder not found: ' + dir));
		});

		return _d.promise;
	}

	function fileListRecusive(dir) {
		var _d = q.defer(),
			results = [];

		readDir(dir)
			.then(function(list) {
			
				var pending = list.length;
				if (!pending) { _d.resolve(results); return; }

				list.forEach(function(file) {
					file = path.join(dir, file);
					stat(file)
						.then(function(stat) {
							if (stat && stat.isDirectory()) {
								fileListRecusive(file).then(function(res) {
									results = results.concat(res);
									if (!--pending) { _d.resolve(results); return; }
								});
							} else {
								// omit dotfiles
								if (!file.split('/').pop().match(/^\./)) {
									results.push(file);
								}

								if (!--pending) { _d.resolve(results); return; }
							}
						});
				});
			})
			.fail(_d.reject);

		return _d.promise;
	}

	return {
		readFile: getFile,
		writeFile: setFile,
		json: getJson,
		folderList: getFolderList,
		makeDir: setDir,
		fileListRecusive: fileListRecusive
	};
})();
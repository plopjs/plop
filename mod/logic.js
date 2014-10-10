module.exports = (function () {
	'use strict';

	var prompt = require('prompt'),
		q = require('q'),
		path = require('path'),
		colors = require('colors');

	var plop = require('./plop-base'),
		fs = require('./fs-promise');

	var genName = '',
		basePath = '',
		genPath = '',
		plopFolderName = '',
		plopConfigFileName = '',
		config = {},
		sl = '[\\\\/]{1,2}'; // regex slash char

	function getPlopData(gName) {
		var _d = q.defer(),
			configPath;

		genName = gName;
		genPath = path.join(plop.getPlopFolderPath(), gName);
		basePath = plop.getBasePath();
		plopFolderName = plop.getPlopFolder();
		plopConfigFileName = plop.getPlopConfigFile();
		configPath = path.join(genPath, plopConfigFileName);
		
		fs.json(configPath)
			.then(function (cfg) {
				var prompts = cfg.prompts,
					key;

				config = cfg;
				
				for (key in prompts) {
					if (!prompts.hasOwnProperty(key)) { continue; }
					if (prompts[key].pattern) {
						prompts[key].pattern = new RegExp(prompts[key].pattern);
					}
				}

				prompt.message = colors.green(gName);
				prompt.start();
				prompt.get({properties: prompts}, function (err, result) {
					if (err) { _d.reject(err); }
					_d.resolve(result);
				});
			})
			.fail(_d.reject);

		return _d.promise;
	}

	function executePlop(data) {
		var _d = q.defer(),
			newFiles = [],
			changedFiles = [],
			changesFailed = [],
			progress;

		fs.fileListRecusive(genPath)
			.then(function (list) {
				// remove the config file from the list of files to create
				list = list.filter(function (v, i , a) {
					var rx = sl + plopFolderName + sl + genName + sl + plopConfigFileName;
					return !(new RegExp(rx)).test(v);
				});

				// keep track of how many files we need to process
				// so we know when everything is complete
				progress = list.length;
				list.forEach(function (filePath) {
					var rx = new RegExp(sl + plopFolderName + sl + genName + '(' + sl + ')', 'gi');
					// copy the filePath and remove the generator folder
					var newFilePath = filePath.replace(rx, '$1');
					// escape bad handlebar stuff in path
					newFilePath = newFilePath.replace(/\\{{/g, '\\\\{{');
					// render the template for the filename
					newFilePath = plop.renderString(newFilePath, data);
					newFiles.push(newFilePath);

					fs.makeDir(path.dirname(newFilePath))
						.then(function () { return fs.readFile(filePath); })
						.then(function (fileData) {
							return fs.writeFile(newFilePath, plop.renderString(fileData, data));
						})
						.then(function () {
							if (!--progress) {
								_d.resolve(newFiles);
							}
						});
				});
				
				_d.resolve(list);
			})
			.then(function () {
				var _d = q.defer(),
					fileName, filePath;

				if (!config.modify) { _d.resolve(); }
				progress = Object.keys(config.modify).length;
				for (fileName in config.modify) {

					if (!config.modify.hasOwnProperty(fileName)) { continue; }
					filePath = path.join(basePath, fileName);
					fs.fileExists(filePath)
						.then(fs.readFile)
						.then(function (fileData) {
							var i = 0,
								len = config.modify[fileName].length,
								newFileData = fileData,
								action;

							for (; i < len; i++) {
								action = config.modify[fileName][i];

								if (!action.pattern) { continue; }
								if (action.append) {
									newFileData = newFileData.replace(new RegExp('(' + action.pattern + ')', 'gi'), '$1' + plop.renderString(action.append, data));
								}
								if (action.prepend) {
									newFileData = newFileData.replace(new RegExp('(' + action.pattern + ')', 'gi'), plop.renderString(action.prepend, data) + '$1');
								}
								if (action.replace) {
									newFileData = newFileData.replace(new RegExp(action.pattern, 'gi'), plop.renderString(action.replace, data));
								}
							}

							changedFiles.push(path);
							if (!--progress) { _d.resolve(); }

							return fs.writeFile(filePath, newFileData);
						})
						.fail(function () {
							changesFailed.push(filePath);
							if (!--progress) { _d.resolve(); }
						});
				}

				return _d.promise;
			})
			.fail(_d.reject);

		return _d.promise;
	}

	return {
		getPlopData: getPlopData,
		executePlop: executePlop
	};
})();
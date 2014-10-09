module.exports = (function () {
	'use strict';

	var prompt = require('prompt'),
		q = require('q'),
		path = require('path'),
		colors = require('colors');

	var plop = require('./plop-base'),
		fs = require('./fs-promise');

	var genName = '',
		genPath = '',
		plopFolderName = '',
		config = {};

	function getPlopData(gName) {
		var _d = q.defer(),
			configPath;

		genName = gName;
		genPath = path.join(plop.getPlopFolderPath(), gName);
		plopFolderName = plop.getPlopFolder();
		configPath = path.join(genPath, 'config.json');
		
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
			progress;

		fs.fileListRecusive(genPath)
			.then(function (list) {
				// remove the config file from the list of files to create
				list = list.filter(function (v, i , a) {
					return !(new RegExp('[\\\\/]{1,2}' + plopFolderName + '[\\\\/]{1,2}' + genName + '[\\\\/]{1,2}config.json')).test(v);
				});

				// keep track of how many files we need to process
				// so we know when everything is complete
				progress = list.length;
				list.forEach(function (filePath) {
					// copy the filePath and remove the generator folder
					var newFilePath = filePath.replace(new RegExp('[\\\\/]{1}' + plopFolderName + '[\\\\/]{1}' + genName + '([\\\\/]{1})', 'gi'), '$1');
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
			});
			// .then();

		return _d.promise;
	}

	return {
		getPlopData: getPlopData,
		executePlop: executePlop
	};
})();
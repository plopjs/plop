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
		config = {};

	function getPlopData(gName) {
		genName = gName;
		basePath = plop.getPlopfilePath();
		config = plop.getGenerator(gName);

		var _d = q.defer(),
			prompts = config.prompts;
		
		prompt.message = colors.green(gName);
		prompt.start();
		prompt.get({properties: prompts}, function (err, result) {
			if (err) { _d.reject(err); }
			_d.resolve(result);
		});

		return _d.promise;
	}

	function makePath(p) {
		return path.join(basePath, p);
	}

	function executePlop(data) {
		var _d = q.defer(),
			_c = q.defer(),
			chain = _c.promise,
			changes = [],
			failedChanges = [],
			actions = config.actions,
			abort = false;

		actions.forEach(function (action, idx) {
			chain = chain.then(function () {
				var _d = q.defer(),
					_chain = _d.promise,
					template = action.template || '',
					filePath = makePath(plop.renderString(action.path || '', data));
				
				_chain = _chain.then(function () {
					if (template) {
						return template;
					} else if(action.templateFile) {
						return fs.readFile(makePath(action.templateFile));
					} else {
						throw Error('No valid template found for action #' + (idx + 1));
					}
				}).then(function (t) {
					template = t;
					return fs.fileExists(filePath);
				}).then(function (pathExists) {
					if (filePath) {
						if (action.type === 'add') {
							if (pathExists) {
								throw Error('File already exists: ' + filePath);
							}
							return fs.writeFile(filePath, plop.renderString(template, data));
						} else if (action.type === 'modify') {
							return fs.readFile(filePath)
								.then(function (fileData) {
									fileData = fileData.replace(action.pattern, plop.renderString(template, data));
									return fs.writeFile(filePath, fileData);
								});
						} else {
							throw Error('Invalid action type: ' + action.type);
						}
					} else {
						throw Error('No valid path provided for action #' + (idx + 1));
					}
				}).then(function () {
					changes.push({
						type: action.type,
						path: filePath
					});
				}).fail(function (err) {
					failedChanges.push({
						type: action.type,
						path: filePath,
						error: err.message
					});
					if (action.abortOnFail) { abort = true; }

				});

				if (!abort) {
					_d.resolve();
				} else {
					_d.reject(Error('Aborted'));
				}
				return _chain;
			});
		});

		chain = chain.then(function () {
			_d.resolve({
				changes: changes,
				failures: failedChanges
			});
		});

		_c.resolve();

		return _d.promise;
	}

	return {
		getPlopData: getPlopData,
		executePlop: executePlop
	};
})();
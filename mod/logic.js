'use strict';

module.exports = (function () {
	var q = require('q');
	var path = require('path');
	var colors = require('colors');

	var plop = require('./plop-base');
	var fs = require('./fs-promise');

	var genName = '';
	var basePath = '';
	var abort = false;
	var config = {};

	// triggers inquirer with the correct prompts for this generator
	// returns a promise that resolves with the user's answers
	function getPlopData(gName) {
		genName = gName;
		basePath = plop.getPlopfilePath();
		config = plop.getGenerator(gName);

		var _d = q.defer();
		var prompts = config.prompts.map(function (p) {
				p.message = colors.green('[' + gName.toUpperCase() + '] ') + p.message;
				return p;
			});

		plop.inquirer.prompt(prompts, function (result) {
			_d.resolve(result);
		});

		return _d.promise;
	}

	// if not already an absolute path, make an absolute path from the basePath (plopfile location)
	function makePath(p) {
		return path.isAbsolute(p) ? p : path.join(basePath, p);
	}

	// Run the actions for this generator
	function executePlop(data) {
		var _d = q.defer();				// defer for overall plop execution
		var _c = q.defer();				// defer to track the chain of action
		var chain = _c.promise;			// chain promise
		var changes = [];				// array of changed made by the actions
		var failedChanges = [];			// array of actions that failed
		var actions = config.actions;	// the list of actions to execute

		// if action is a function, run it to get our array of actions
		if(typeof actions === 'function') {
			actions = actions(data);
		}

		// setup the chain of actions for this generator
		actions.forEach(function (action, idx) {
			chain = chain.then(function () {

				if (typeof action === 'function') {
					return executeCustomAction(action, idx, data, changes, failedChanges);
				} else {
					return executeActionChain(action, idx, data, changes, failedChanges);
				}
			});
		});

		// add the final step to the chain (reporting the status)
		chain = chain.then(function () {
			_d.resolve({
				changes: changes,
				failures: failedChanges
			});
		});

		_c.resolve();

		return _d.promise;
	}

	function executeCustomAction(action, idx, data, changes, failedChanges) {
		// bail out if a previous action aborted
		if (abort) {
			failedChanges.push({
				type: action.name || 'function',
				path: '',
				error: 'Aborted on Failure'
			});
			return q.resolve();
		}
		// convert any returned data into a promise to
		// return and wait on
		try {
			return q(action(data)).then(
				// show the resolved value in the console
				function (result) {
					changes.push({
						type: action.name || 'function',
						path: colors.blue(result.toString())
					});
				},
				// a rejected promise is treated as a failure
				function (err) {
					abort = true;
					failedChanges.push({
						type: action.name || 'function',
						path: '',
						error: err.message || err.toString()
					});
				}
			);
		// if we catch a synchronous error, treat it as a failure
		} catch (err) {
			abort = true;
			failedChanges.push({
				type: action.name || 'function',
				path: '',
				error: err.message
			});
			return q.resolve();
		}
	}

	function executeActionChain(action, idx, data, changes, failedChanges) {
		var _d = q.defer();
		var _chain = _d.promise;
		var template = action.template || '';
		var filePath = makePath(plop.renderString(action.path || '', data));

		// ------- building the chain of events for this action ------- //
		// get the template from either template or templateFile
		_chain = _chain.then(function () {
			if (template) {
				return template;
			} else if(action.templateFile) {
				return fs.readFile(makePath(action.templateFile));
			} else {
				throw Error('No valid template found for action #' + (idx + 1));
			}

		}).then(function (templateContent) {
			// save template content outside of the promise function scope
			template = templateContent;

			// resolve the file path existence for the next link in the chain
			return fs.fileExists(filePath);

		// do the actual action work
		}).then(function (pathExists) {
			if (filePath) {
				if (action.type === 'add') {
					if (pathExists) { throw Error('File already exists: ' + filePath); }
					return fs.makeDir(path.dirname(filePath))
						.then(function () {
							return fs.writeFile(filePath, plop.renderString(template, data));
						});
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
			_d.reject(Error('Aborted on Failure'));
		}

		return _chain;
	}

	return {
		getPlopData: getPlopData,
		executePlop: executePlop
	};
})();

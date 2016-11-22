'use strict';

import co from 'co';
import path from 'path';
import colors from 'colors';
import * as fspp from './fs-promise-proxy';

export default function (plopfileApi, actionTypes) {
	const bakedInActionTypes = ['add', 'modify'];
	var abort;

	// if not already an absolute path, make an absolute path from the basePath (plopfile location)
	const makeTmplPath = p => path.resolve(plopfileApi.getPlopfilePath(), p);
	const makeDestPath = p => path.resolve(plopfileApi.getDestBasePath(), p);

	// triggers inquirer with the correct prompts for this generator
	// returns a promise that resolves with the user's answers
	const runGeneratorPrompts = co.wrap(function* (genObject) {
		if (genObject.prompts == null) {
			throw Error(`${genObject.name} does no have prompts.`);
		}
		return yield plopfileApi.inquirer.prompt(genObject.prompts);
	});

	// Run the actions for this generator
	const runGeneratorActions = co.wrap(function* (genObject, data) {
		var changes = [];          // array of changed made by the actions
		var failures = [];         // array of actions that failed
		var {actions} = genObject; // the list of actions to execute

		abort = false;

		// if action is a function, run it to get our array of actions
		if (typeof actions === 'function') { actions = actions(data); }

		// if actions are not defined... we cannot proceed.
		if (actions == null) {
			throw Error(`${genObject.name} does no have actions.`);
		}

		// if actions are not an array, invalid!
		if (!(actions instanceof Array)) {
			throw Error(`${genObject.name} does has invalid actions.`);
		}

		for (let action of actions) {
			// bail out if a previous action aborted
			if (abort) {
				failures.push({
					type: action.type || '',
					path: action.path || '',
					error: 'Aborted due to previous action failure'
				});
				continue;
			}

			const actionCfg = (typeof action === 'function' ? {} : action);

			// handle imported actions
			if (!bakedInActionTypes.includes(actionCfg.type) && actionCfg.type in actionTypes) {
				action = actionTypes[actionCfg.type];
			}

			const actionInterfaceTest = testActionInterface(action);
			if (actionInterfaceTest !== true) {
				failures.push(actionInterfaceTest);
				continue;
			}

			try {
				let result;
				if (typeof action === 'function') {
					result = yield executeCustomAction(action, actionCfg, data);
				} else {
					result = yield executeAction(action, data);
				}
				changes.push(result);
			} catch(failure) {
				failures.push(failure);
			}
		}

		return { changes, failures };
	});

	/////
	// action handlers
	//

	// custom action functions
	const executeCustomAction = co.wrap(function* (action, cfg, data) {
		const failure = makeErrorLogger(cfg.type || 'function', '', cfg.abortOnFail);

		// convert any returned data into a promise to
		// return and wait on
		return yield Promise.resolve(action(data, cfg, plopfileApi)).then(
			// show the resolved value in the console
			result => ({
				type: cfg.type || 'function',
				path: colors.blue(result.toString())
			}),
			// a rejected promise is treated as a failure
			function (err) {
				throw failure(err.message || err.toString());
			}
		);
	});

	// basic function objects
	const executeAction = co.wrap(function* (action, data) {
		var {template} = action;
		const fileDestPath = makeDestPath(plopfileApi.renderString(action.path || '', data));
		const failure = makeErrorLogger(action.type, fileDestPath, action.abortOnFail);

		try {
			if (action.templateFile) {
				template = yield fspp.readFile(makeTmplPath(action.templateFile));
			}
			if (template == null) { template = ''; }

			// check path
			const pathExists = yield fspp.fileExists(fileDestPath);

			// handle type
			if (action.type === 'add') {
				if (pathExists) {
					throw failure('File already exists');
				} else {
					yield fspp.makeDir(path.dirname(fileDestPath));
					yield fspp.writeFile(fileDestPath, plopfileApi.renderString(template, data));
				}
			} else if (action.type === 'modify') {
				if (!pathExists) {
					throw failure('File does not exists');
				} else {
					var fileData = yield fspp.readFile(fileDestPath);
					fileData = fileData.replace(action.pattern, plopfileApi.renderString(template, data));
					yield fspp.writeFile(fileDestPath, fileData);
				}
			} else {
				throw failure(`Invalid action type: ${action.type}`);
			}

			return {
				type: action.type,
				path: fileDestPath
			};
		} catch(err) {
			throw failure(err.error || err.message || JSON.stringify(err));
		}
	});

	function testActionInterface(action) {
		// action functions are valid, end of story
		if (typeof action === 'function') { return true; }

		// it's not even an object, you fail!
		if (typeof action !== 'object') {
			return {type: '', path: '', error: `Invalid action object: ${JSON.stringify(action)}`};
		}

		var {type, path, abortOnFail} = action;
		const failure = makeErrorLogger(type, path, abortOnFail);

		if (!bakedInActionTypes.includes(type)) {
			return failure(`Invalid action type "${type}"`);
		}

		if (typeof path !== 'string' || path.length === 0) {
			return failure(`Invalid path "${path}"`);
		}

		return true;
	}

	function makeErrorLogger(type, path, abortOnFail) {
		return function (error) {
			if (abortOnFail !== false) { abort = true; }
			return { type, path, error };
		};
	}

	return {
		runGeneratorActions,
		runGeneratorPrompts
	};
}

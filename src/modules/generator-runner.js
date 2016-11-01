'use strict';

import co from 'co';
import path from 'path';
import colors from 'colors';
import * as fspp from './fs-promise-proxy';

export default function (plop) {
	var abort, basePath;

	// if not already an absolute path, make an absolute path from the basePath (plopfile location)
	const makePath = p => path.isAbsolute(p) ? p : path.join(basePath, p);

	// triggers inquirer with the correct prompts for this generator
	// returns a promise that resolves with the user's answers
	const runGeneratorPrompts = co.wrap(function* (genObject) {
		if (genObject.prompts == null) {
			throw Error(`${genObject.name} does no have prompts.`);
		}
		return yield plop.inquirer.prompt(genObject.prompts);
	});

	// Run the actions for this generator
	const runGeneratorActions = co.wrap(function* (genObject, data) {
		var changes = [];					// array of changed made by the actions
		var failures = [];				// array of actions that failed
		var {actions} = genObject; // the list of actions to execute

		basePath = genObject.basePath;		// the path that contains this generator's plopfile
		abort = false;

		// if action is a function, run it to get our array of actions
		if(typeof actions === 'function') { actions = actions(data); }

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
					error: `Aborted due to previous action failure`
				});
				continue;
			}

			const actionInterfaceTest = testActionInterface(action);
			if (actionInterfaceTest !== true) {
				failures.push(actionInterfaceTest);
				continue;
			}

			try {
				let result;
				if (typeof action === 'function') {
					result = yield executeCustomAction(action, data);
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
	const executeCustomAction = co.wrap(function* (action, data) {
		const failure = makeErrorLogger(action.type || 'function', '', action.abortOnFail);

		// convert any returned data into a promise to
		// return and wait on
		return yield Promise.resolve(action(data)).then(
			// show the resolved value in the console
			result => ({
				type: action.type || 'function',
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
		const filePath = makePath(plop.renderString(action.path || '', data));
		const failure = makeErrorLogger(action.type, filePath, action.abortOnFail);

		try {
			if (action.templateFile) {
				template = yield fspp.readFile(makePath(action.templateFile));
			}
			if (template == null) { template = ''; }

			// check path
			const pathExists = yield fspp.fileExists(filePath);

			// handle type
			if (action.type === 'add') {
				if (pathExists) {
					throw failure(`File already exists: ${filePath}`);
				} else {
					yield fspp.makeDir(path.dirname(filePath));
					yield fspp.writeFile(filePath, plop.renderString(template, data));
				}
			} else if (action.type === 'modify') {
				if (!pathExists) {
					throw failure(`File does not exists: ${filePath}`);
				} else {
					var fileData = yield fspp.readFile(filePath);
					fileData = fileData.replace(action.pattern, plop.renderString(template, data));
					yield fspp.writeFile(filePath, fileData);
				}
			} else {
				throw failure(`Invalid action type: ${action.type}`);
			}

			return {
				type: action.type,
				path: filePath
			};
		} catch(err) {
			throw failure(JSON.stringify(err));
		}
	});

	function testActionInterface(action) {
		// action functions are valid, end of story
		if (typeof action === 'function') { return true; }

		// it's not even an object, you fail!
		if (typeof action !== 'object') {
			return {type: '', path: '', error: `Invalid action object: ${JSON.stringify(action)}`};
		}

		var {type, path, template, templateFile, pattern, abortOnFail} = action;
		const failure = makeErrorLogger(type, path, abortOnFail);

		const validActionTypes = ['add', 'modify'];
		if (!validActionTypes.includes(type)) {
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

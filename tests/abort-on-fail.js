const fs = require('fs');
const path = require('path');
const nodePlop = require('../lib/index.js');
const mockPath = path.resolve(__dirname, 'mock');
const testSrcPath = `${mockPath}/src`;

/////
// if an action has no path, the action should fail
//

module.exports = function (t) {
	const plop = nodePlop();

	plop.setGenerator('abort-on-fail-true', {
		actions: [{abortOnFail: true}, {}]
	});
	plop.setGenerator('abort-on-fail-false', {
		actions: [{abortOnFail: false}, {}]
	});

	const generatorTrue = plop.getGenerator('abort-on-fail-true');
	const generatorFalse = plop.getGenerator('abort-on-fail-false');

	return generatorTrue.runActions({})
		// check that the file has been created
		.then(function (results) {
			const changes = results.changes;
			const failures = results.failures;

			t.is(changes.length, 0);
			t.is(failures.length, 2);
			t.is(failures[1].error, 'Aborted due to previous action failure');
		})
		.then(() => generatorFalse.runActions({}))
		.then(function (results) {
			const changes = results.changes;
			const failures = results.failures;
			
			t.is(changes.length, 0);
			t.is(failures.length, 2);
			t.not(failures[1].error, 'Aborted due to previous action failure');
		});
};

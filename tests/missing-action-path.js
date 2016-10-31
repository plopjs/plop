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
	const name = 'no path';

	plop.setGenerator('no-path', {
		actions: [
			{ type: 'add', template: '{{name}}', abortOnFail: false },
			{ type: 'add', path: '', template: '{{name}}' }
		]
	});

	const generator = plop.getGenerator('no-path');

	return generator.runActions({name})
		// check that the file has been created
		.then(function (results) {
			const changes = results.changes;
			const failures = results.failures;

			t.is(changes.length, 0);
			t.is(failures.length, 2);
			t.is(failures[0].error, `Invalid path "undefined"`);
			t.is(failures[1].error, `Invalid path ""`);
		});
};

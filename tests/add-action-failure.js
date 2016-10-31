const fs = require('fs');
const path = require('path');
const nodePlop = require('../lib/index.js');
const mockPath = path.resolve(__dirname, 'mock');
const testSrcPath = `${mockPath}/src`;

module.exports = function (t) {
	const plop = nodePlop();
	const name = 'add action failure';

	plop.setGenerator('add-action-failure', {
		description: 'adds a file using a template',
		actions: [{
			type: 'add',
			path: `${testSrcPath}/{{dashCase name}}.txt`,
			template: '{{name}}'
		}]
	});

	const actionAdd = plop.getGenerator('add-action-failure');

	return actionAdd.runActions({name})
		// check that the file has been created
		.then(function (results) {
			t.is(results.changes.length, 1);
			t.is(results.failures.length, 0);
			t.true(fs.existsSync(path.resolve(testSrcPath, 'add-action-failure.txt')));
		})

		// run the add again, should fail due to file already existing
		.then(() => actionAdd.runActions({name}))
		.then(function (results) {
			t.is(results.changes.length, 0);
			t.is(results.failures.length, 1);
		});
};

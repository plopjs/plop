const fs = require('fs');
const path = require('path');
const nodePlop = require('../lib/index.js');
const mockPath = path.resolve(__dirname, 'mock');
const testSrcPath = `${mockPath}/src`;

/////
// no template add action should write a blank file
//

module.exports = function (t) {
	const plop = nodePlop();
	const name = 'no template';

	plop.setGenerator('no-template', {
		actions: [{
			type: 'add',
			path: `${testSrcPath}/{{dashCase name}}.txt`
		}]
	});

	const generator = plop.getGenerator('no-template');

	return generator.runActions({name})
		// check that the file has been created
		.then(function (results) {
			const changes = results.changes;
			const failures = results.failures;
			
			t.is(changes.length, 1);
			t.is(failures.length, 0);
			t.true(fs.existsSync(path.resolve(testSrcPath, 'no-template.txt')));
			t.is(fs.readFileSync(changes[0].path).toString(), '');
		});
};

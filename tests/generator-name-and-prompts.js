const fs = require('fs');
const path = require('path');
const nodePlop = require('../lib/index.js');
const mockPath = path.resolve(__dirname, 'mock');
const testSrcPath = `${mockPath}/src`;
const co = require('co');

///////
// generator name should be defaulted
// runPrompts should reject if there are no prompts
//

module.exports = co.wrap(function* (t) {
	const plop = nodePlop();

	plop.setGenerator('', {});
	plop.setGenerator('bad-actions-function', { actions: () => 'bad actions output' });
	const generatorOne = plop.getGenerator('generator-1');
	const generatorBadActionsFunction = plop.getGenerator('bad-actions-function');

	// generatorOne should not be able to run the prompts (it has none)
	t.is(typeof generatorOne, 'object');
	try {
		yield generatorOne.runPrompts();
		t.fail();
	} catch(err) {
		t.is(err.message, 'generator-1 does no have prompts.');
	}

	// generatorOne should not be able to run the actions (it has none)
	try {
		yield generatorOne.runActions();
		t.fail();
	} catch(err) {
		t.is(err.message, 'generator-1 does no have actions.');
	}

	// bad-actions-function should not be able to run the actions
	// the actions function does not return valid output
	try {
		yield generatorBadActionsFunction.runActions();
		t.fail();
	} catch(err) {
		t.is(err.message, 'bad-actions-function does has invalid actions.');
	}
});

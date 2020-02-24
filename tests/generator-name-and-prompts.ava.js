import AvaTest from './_base-ava-test';
const {test, nodePlop} = (new AvaTest(__filename));

const plop = nodePlop();

///////
// generator name should be defaulted
// runPrompts should reject if there are no prompts
//

test.before(() => {
	plop.setGenerator('', {});
	plop.setGenerator('bad-actions-function', {
		actions: () => {
			'bad actions output';
		}
	});
});

test('generator should not be able to run promps if it has none', async function (t) {
	const generatorOne = plop.getGenerator('generator-1');
	t.is(typeof generatorOne, 'object');

	try {
		await generatorOne.runPrompts();
		t.fail();
	} catch(err) {
		t.is(err.message, 'generator-1 has no prompts');
	}
});

test('generator should not be able to run actions if it has none', async function (t) {
	const generatorOne = plop.getGenerator('generator-1');
	t.is(typeof generatorOne, 'object');

	try {
		await generatorOne.runActions();
		t.fail();
	} catch(err) {
		t.is(err.message, 'generator-1 has no actions');
	}
});

test('generator should not be able to run invalid actions data', async function (t) {
	const generatorBadActions = plop.getGenerator('bad-actions-function');

	try {
		await generatorBadActions.runActions();
		t.fail();
	}catch(err){
		t.is(err.message, 'bad-actions-function has no actions');
	}
});

import AvaTest from './_base-ava-test';
const {test, nodePlop} = (new AvaTest(__filename));

const plop = nodePlop();

/////
// if an action has no path, the action should fail
//

test('set generator should return the generator object', function (t) {
	const generator = plop.setGenerator('name', {});

	t.is(typeof generator.runPrompts, 'function');
	t.is(typeof generator.runActions, 'function');
	t.is(generator.name, 'name');
});

test('set generator without name should return the generator object', function (t) {
	const generator = plop.setGenerator('', {});

	t.is(typeof generator.runPrompts, 'function');
	t.is(typeof generator.runActions, 'function');
	t.true(generator.name.startsWith('generator-'));
});

test('set generator with null name should return the generator object', function (t) {
	const generator = plop.setGenerator(null, {});

	t.is(typeof generator.runPrompts, 'function');
	t.is(typeof generator.runActions, 'function');
	t.true(generator.name.startsWith('generator-'));
});

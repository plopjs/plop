import AvaTest from './_base-ava-test.js';
const __filename = fileURLToPath(import.meta.url);
const {test, nodePlop} = (new AvaTest(__filename));
import {fileURLToPath} from 'node:url';

var plop;
test.before(async () => {
	plop = await nodePlop();
});

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

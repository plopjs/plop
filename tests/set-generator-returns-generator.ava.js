import fs from 'fs';
import co from 'co';
import path from 'path';
import AvaTest from './_base-ava-test';
const {test, mockPath, testSrcPath, nodePlop} = new AvaTest(__filename);

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

import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test.js';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const {test, testSrcPath, nodePlop} = (new AvaTest(__filename));

var plop;
var baseAction;
var actionAdd;
var actionAddWithSkip;
test.before(async () => {
	plop = await nodePlop();

	baseAction = { type: 'add', template: '{{name}}', path: `${testSrcPath}/{{name}}.txt` };
	actionAdd = plop.setGenerator('add-action', {
		actions: [baseAction]
	});
	actionAddWithSkip = plop.setGenerator('add-action-skip-exists-true', {
		actions: [Object.assign({}, baseAction, {skipIfExists: true})]
	});

});

test('Check that the file is created', async function (t) {
	const filePath = path.resolve(testSrcPath, 'test1.txt');
	const result = await actionAdd.runActions({name: 'test1'});
	t.is(result.changes.length, 1);
	t.is(result.failures.length, 0);
	t.true(fs.existsSync(filePath));
});

test('If run twice, should fail due to file already exists', async function (t) {
	const filePath = path.resolve(testSrcPath, 'test2.txt');
	// add the test file
	const result = await actionAdd.runActions({name: 'test2'});
	t.is(result.changes.length, 1);
	t.is(result.failures.length, 0);
	t.true(fs.existsSync(filePath));
	// try to add it again
	const result2 = await actionAdd.runActions({name: 'test2'});
	t.is(result2.changes.length, 0);
	t.is(result2.failures.length, 1);
	t.true(fs.existsSync(filePath));
});

test('If skipIfExists is true, it should not fail', async function (t) {
	const filePath = path.resolve(testSrcPath, 'test3.txt');
	// add the test file
	const result = await actionAdd.runActions({name: 'test3'});
	t.is(result.changes.length, 1);
	t.is(result.failures.length, 0);
	t.true(fs.existsSync(filePath));
	// try to add it again
	const result2 = await actionAddWithSkip.runActions({name: 'test3'});
	t.is(result2.changes.length, 1);
	t.is(result2.failures.length, 0);
	t.true(fs.existsSync(filePath));
});

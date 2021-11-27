import {fileExists} from '../src/fs-promise-proxy.js';
import path from 'path';
import AvaTest from './_base-ava-test.js';
import {fileURLToPath} from 'node:url';
import {pathToFileURL} from "url";

const __filename = fileURLToPath(import.meta.url);
const {test, mockPath, testSrcPath, nodePlop} = (new AvaTest(__filename));

/////
// imported custom actions should execute
//


var customAction;
test.before(async () => {
	customAction = (await import(pathToFileURL(path.resolve(mockPath, 'custom-action.js')).href)).default;
});

test('imported custom action should execute correctly', async function (t) {
	const plop = await nodePlop();
	const testFilePath = path.resolve(testSrcPath, 'test.txt');
	plop.setActionType('custom-del', customAction);

	// add the file
	const addTestFile = { type: 'add', path: testFilePath };
	// remove the file
	const deleteTestFile = { type: 'custom-del', path: testFilePath };

	const generator = plop.setGenerator('', {
		actions: [addTestFile, deleteTestFile]
	});

	t.is(typeof plop.getActionType('custom-del'), 'function');

	const results = await generator.runActions({});
	const testFileExists = await fileExists(testFilePath);

	t.is(results.failures.length, 0);
	t.is(results.changes.length, 2);
	t.false(testFileExists);
});


test('imported custom action can throw errors', async function (t) {
	const plop = await nodePlop();
	const testFilePath = path.resolve(testSrcPath, 'test2.txt');
	plop.setActionType('custom-del', customAction);

	// remove the file
	const deleteTestFile = { type: 'custom-del', path: testFilePath };

	// remove a file that doesn't exist (should error)
	const generator = plop.setGenerator('', {actions: [deleteTestFile]});
	const results = await generator.runActions({});

	t.is(results.failures.length, 1);
	t.true(results.failures[0].error.startsWith('Path does not exist'));
});

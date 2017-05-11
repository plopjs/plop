import {fileExists} from '../src/fs-promise-proxy';
import co from 'co';
import path from 'path';
import AvaTest from './_base-ava-test';
const {test, mockPath, testSrcPath, nodePlop} = (new AvaTest(__filename));

/////
// imported custom actions should execute
//
const customAction = require(path.resolve(mockPath, 'custom-action.js'));

test('imported custom action should execute correctly', co.wrap(function* (t) {
	const plop = nodePlop();
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

	const results = yield generator.runActions({});
	const testFileExists = yield fileExists(testFilePath);

	t.is(results.failures.length, 0);
	t.is(results.changes.length, 2);
	t.false(testFileExists);
}));


test('imported custom action can throw errors', co.wrap(function* (t) {
	const plop = nodePlop();
	const testFilePath = path.resolve(testSrcPath, 'test2.txt');
	plop.setActionType('custom-del', customAction);

	// remove the file
	const deleteTestFile = { type: 'custom-del', path: testFilePath };

	// remove a file that doesn't exist (should error)
	const generator = plop.setGenerator('', {actions: [deleteTestFile]});
	const results = yield generator.runActions({});

	t.is(results.failures.length, 1);
	t.true(results.failures[0].error.startsWith('Path does not exist'));
}));

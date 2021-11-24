import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test.js';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const {test, mockPath, testSrcPath, nodePlop} = (new AvaTest(__filename));

var plop;
var dynamicActions;
test.before(async () => {
	plop = await nodePlop(`${mockPath}/plopfile.js`);
	dynamicActions = plop.getGenerator('dynamic-actions');
});

test.before(() => {
	return dynamicActions.runActions({name: 'potato man', yesPotatoes: true});
});

test('Check that the potato-man-burger.txt file has been created', t => {
	const burgerFilePath = path.resolve(testSrcPath, 'potato-man-burger.txt');
	const potatoFilePath = path.resolve(testSrcPath, 'potato-man-burger.txt');

	// both files should have been created
	t.true(fs.existsSync(burgerFilePath));
	t.true(fs.existsSync(potatoFilePath));
});

test.before(() => {
	return dynamicActions.runActions({name: 'potato hater', yesPotatoes: false});
});

test('Check that the file potato-hater-burger.txt', t => {
	const burgerFilePath = path.resolve(testSrcPath, 'potato-hater-burger.txt');
	const potatoFilePath = path.resolve(testSrcPath, 'potato-hater-potatoes.txt');

	// only the burger file should have been created
	t.true(fs.existsSync(burgerFilePath));
	t.false(fs.existsSync(potatoFilePath));
});

import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test.js';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const {test, mockPath, testSrcPath, nodePlop} = (new AvaTest(__filename));

test.serial('Check that ESM default loads', async t => {
	const plop = await nodePlop(`${mockPath}/plopfile.js`);
	const basicAdd = plop.getGenerator('basic-add');
	await basicAdd.runActions({name: 'this is a test', age: '21'})

	const filePath = path.resolve(testSrcPath, 'this-is-a-test.txt');
	t.true(fs.existsSync(filePath));
});

test.serial('Check that MJS loads', async t => {
	const plop = await nodePlop(`${mockPath}/plopfile.mjs`);
	const basicAdd = plop.getGenerator('basic-add');
	await basicAdd.runActions({name: 'this is a test', age: '21'})

	const filePath = path.resolve(testSrcPath, 'this-is-a-test.txt');
	t.true(fs.existsSync(filePath));
});

test.serial('Check that CJS loads', async t => {
	const plop = await nodePlop(`${mockPath}/plopfile.cjs`);
	const basicAdd = plop.getGenerator('basic-add');
	await basicAdd.runActions({name: 'this is a test', age: '21'})

	const filePath = path.resolve(testSrcPath, 'this-is-a-test.txt');
	t.true(fs.existsSync(filePath));
});

test.serial('Check that CJS doesn\'t load', async t => {
	await t.throwsAsync(() => nodePlop(`${mockPath}/plopfile-cjs.js`));
});

test.serial('Check that incorrect (CJS) JS file doesn\'t load', async t => {
	await t.throwsAsync(() => nodePlop(`${mockPath}/plopfile-cjs.js`));
});

test.serial('Check that incorrect MJS doesn\'t load', async t => {
	await t.throwsAsync(() => nodePlop(`${mockPath}/plopfile-cjs.mjs`));
});

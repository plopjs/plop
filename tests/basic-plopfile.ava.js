import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test.js';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const {test, mockPath, testSrcPath, nodePlop} = (new AvaTest(__filename));

var plop;
var basicAdd;
test.before(async () => {
	plop = await nodePlop(`${mockPath}/plopfile.js`);
});

test.serial('Check that the file has been created', async t => {
	basicAdd = plop.getGenerator('basic-add');
	await basicAdd.runActions({name: 'this is a test', age: '21'})

	const filePath = path.resolve(testSrcPath, 'this-is-a-test.txt');
	t.true(fs.existsSync(filePath));
});

test.serial('Test the content of the rendered file this-is-a-test.txt', async t => {
	basicAdd = plop.getGenerator('basic-add');
	await basicAdd.runActions({name: 'this is a test', age: '21'})

	const filePath = path.resolve(testSrcPath, 'this-is-a-test.txt');
	const content = fs.readFileSync(filePath).toString();

	t.true(content.includes('name: this is a test'));
	t.true(content.includes('upperCase: THIS_IS_A_TEST'));
});

test.serial('Test the content of the rendered file _THIS_IS_A_TEST.txt', async t => {
	const filePath = path.resolve(testSrcPath, '_THIS_IS_A_TEST.txt');
	const content = fs.readFileSync(filePath).toString();

	t.true(content.includes('inline template: this is a test'));
	t.true(content.includes('test: basic-plopfile-test'));
	t.true(content.includes('propertyPathTest: basic-plopfile-test-propertyPath-value-index-1'));
});

test.serial('Test the content of the rendered file change-me.txt', async t => {
	basicAdd = plop.getGenerator('basic-add');
	await basicAdd.runActions({name: 'this is a test', age: '21'})

	const filePath = path.resolve(testSrcPath, 'change-me.txt');
	const content = fs.readFileSync(filePath).toString();

	t.true(content.includes('this is a test: 21'));
	t.true(content.includes('this is prepended! replaced => this-is-a-test: 21'));
});

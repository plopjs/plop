import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test';
const {test, mockPath, testSrcPath, nodePlop} = (new AvaTest(__filename));

const plop = nodePlop(`${mockPath}/plopfile.js`);
const basicAdd = plop.getGenerator('basic-add');

test.before(() => basicAdd.runActions({name: 'this is a test', age: '21'}));

test('Check that the file has been created', t => {
	const filePath = path.resolve(testSrcPath, 'this-is-a-test.txt');
	t.true(fs.existsSync(filePath));
});

test('Test the content of the rendered file this-is-a-test.txt', t => {
	const filePath = path.resolve(testSrcPath, 'this-is-a-test.txt');
	const content = fs.readFileSync(filePath).toString();

	t.true(content.includes('name: this is a test'));
	t.true(content.includes('upperCase: THIS_IS_A_TEST'));
});

test('Test the content of the rendered file _THIS_IS_A_TEST.txt', t => {
	const filePath = path.resolve(testSrcPath, '_THIS_IS_A_TEST.txt');
	const content = fs.readFileSync(filePath).toString();

	t.true(content.includes('inline template: this is a test'));
	t.true(content.includes('test: basic-plopfile-test'));
	t.true(content.includes('propertyPathTest: basic-plopfile-test-propertyPath-value-index-1'));
});

test('Test the content of the rendered file change-me.txt', t => {
	const filePath = path.resolve(testSrcPath, 'change-me.txt');
	const content = fs.readFileSync(filePath).toString();

	t.true(content.includes('this is a test: 21'));
	t.true(content.includes('this is prepended! replaced => this-is-a-test: 21'));
});

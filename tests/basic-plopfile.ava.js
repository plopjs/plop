import test from 'ava';
import fs from 'fs';
import path from 'path';
import del from 'del';
import nodePlop from '../lib/index.js';

const mockPath = path.resolve(__dirname, 'mock');
const testSrcPath = `${mockPath}/src/basic-plopfile`;
const plop = nodePlop(`${mockPath}/plopfile.js`);
const basicAdd = plop.getGenerator('basic-add');
const clear = () => {
	del.sync(testSrcPath);
}

test.before(() => basicAdd.runActions({name: 'this is a test', age: '21'}));
test.after(clear);


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
});

test('Test the content of the rendered file change-me.txt', t => {
	const filePath = path.resolve(testSrcPath, 'change-me.txt');
	const content = fs.readFileSync(filePath).toString();

	t.true(content.includes('this is a test: 21'));
	t.true(content.includes('this is prepended! replaced => this-is-a-test: 21'));
});
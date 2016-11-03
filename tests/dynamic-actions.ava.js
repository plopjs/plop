import test from 'ava';
import fs from 'fs';
import path from 'path';
import del from 'del';
import nodePlop from '../lib/index.js';

const mockPath = path.resolve(__dirname, 'mock');
const testSrcPath = `${mockPath}/src/dynamic-actions`;
const plop = nodePlop(`${mockPath}/plopfile.js`);
const dynamicActions = plop.getGenerator('dynamic-actions');
const clear = () => {
	del.sync(testSrcPath);
}

test.before( () => {
	return dynamicActions.runActions({name: 'potato man', yesPotatoes: true});
});

test.after(clear);

test('Check that the potato-man-burger.txt file has been created', t => {
	const filePath = path.resolve(testSrcPath, 'potato-man-burger.txt');
	t.true(fs.existsSync(filePath));
});

test.before( () => {
	return dynamicActions.runActions({name: 'potato hater', yesPotatoes: false});
});

test('Check that the file potato-hater-burger.txt', t => {
	const filePathPotatoHaterBurger = path.resolve(testSrcPath, 'potato-hater-burger.txt');
	const filePathPotatoHaterPotatoes = path.resolve(testSrcPath, 'potato-hater-potatoes.txt');
	t.true(fs.existsSync(filePathPotatoHaterBurger));
	t.false(fs.existsSync(filePathPotatoHaterPotatoes));
});
import test from 'ava';
import fs from 'fs';
import path from 'path';
import del from 'del';
import nodePlop from '../lib/index.js';

const mockPath = path.resolve(__dirname, 'mock');
const testSrcPath = `${mockPath}/src/add-action-failure`;
const plop = nodePlop();
const clear = () => {
	del.sync(testSrcPath);
};

test.beforeEach( async t => {
	const name = 'add action failure';
	plop.setGenerator('add-action-failure', {
		description: 'adds a file using a template',
		actions: [{
			type: 'add',
			path: `${testSrcPath}/{{dashCase name}}.txt`,
			template: '{{name}}'
		}]
	});

	const actionAdd = plop.getGenerator('add-action-failure');
	t.context = await actionAdd.runActions({name});
});

test.after(clear);


test.serial('Check that the file has been created', t => {
	const result = t.context;
	const filePath = path.resolve(testSrcPath, 'add-action-failure.txt');

	t.is(result.changes.length, 1);
	t.is(result.failures.length, 0);
	t.true(fs.existsSync(filePath));
});

test.serial('Run the add again, should fail due to file already exists', t => {
	const result = t.context;

	t.is(result.changes.length, 0);
	t.is(result.failures.length, 1);
});
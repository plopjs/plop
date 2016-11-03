import test from 'ava';
import fs from 'fs';
import path from 'path';
import del from 'del';
import nodePlop from '../lib/index.js';

const mockPath = path.resolve(__dirname, 'mock');
const testSrcPath = `${mockPath}/src/add-action-no-template`;
const plop = nodePlop();
const clear = () => {
	del.sync(testSrcPath);
}

test.beforeEach( async t => {
	const name = 'no template';

	plop.setGenerator('no-template', {
		actions: [{
			type: 'add',
			path: `${testSrcPath}/{{dashCase name}}.txt`
		}]
	});

	const generator = plop.getGenerator('no-template');
	t.context = await generator.runActions({name});
});
test.after(clear);

test('Check that the file has been created', t => {
	const changes = t.context.changes;
	const failures = t.context.failures;
	const filePath = path.resolve(testSrcPath, 'no-template.txt');
	const content = fs.readFileSync(changes[0].path).toString();

	t.is(changes.length, 1);
	t.is(failures.length, 0);
	t.true(fs.existsSync(filePath));
	t.is(content, '');
});
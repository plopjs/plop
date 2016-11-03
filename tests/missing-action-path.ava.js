import test from 'ava';
import fs from 'fs';
import path from 'path';
import nodePlop from '../lib/index.js';

const mockPath = path.resolve(__dirname, 'mock');
const testSrcPath = `${mockPath}/src/missing-action-path`;
const plop = nodePlop();

test.beforeEach( async t => {
	const name = 'no path';

	plop.setGenerator('no-path', {
		actions: [
			{ type: 'add', template: '{{name}}', abortOnFail: false },
			{ type: 'add', path: '', template: '{{name}}' }
		]
	});

	const generator = plop.getGenerator('no-path');
	t.context = await generator.runActions({name});
});

test('Check that the file has been created', t => {
	const changes = t.context.changes;
	const failures = t.context.failures;

	t.is(changes.length, 0);
	t.is(failures.length, 2);
	t.is(failures[0].error, `Invalid path "undefined"`);
	t.is(failures[1].error, `Invalid path ""`);
});
import test from 'ava';
import fs from 'fs';
import path from 'path';
import nodePlop from '../lib/index.js';

const mockPath = path.resolve(__dirname, 'mock');
const testSrcPath = `${mockPath}/src/abort-on-fail`;
const plop = nodePlop();

/////
// if an action has no path, the action should fail
//

test.beforeEach( async t => {

	plop.setGenerator('abort-on-fail-true', {
		actions: [{abortOnFail: true}, {}]
	});	
	plop.setGenerator('abort-on-fail-false', {
		actions: [{abortOnFail: false}, {}]
	});

	const generatorTrue = plop.getGenerator('abort-on-fail-true');
	const generatorFalse = plop.getGenerator('abort-on-fail-false');

	t.context.generatorTrue = await generatorTrue.runActions({});
	t.context.generatorFalse = await generatorFalse.runActions({});
});

test('Check that the file has been created with generatorTrue', t => {
	const changes = t.context.generatorTrue.changes;
	const failures = t.context.generatorTrue.failures;

	t.is(changes.length, 0);
	t.is(failures.length, 2);
	t.is(failures[1].error, 'Aborted due to previous action failure');
});

test('Check that the file has been created with generatorFalse', t => {
	const changes = t.context.generatorFalse.changes;
	const failures = t.context.generatorFalse.failures;

	t.is(changes.length, 0);
	t.is(failures.length, 2);
	t.not(failures[1].error, 'Aborted due to previous action failure');
});
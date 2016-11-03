import test from 'ava';
import fs from 'fs';
import path from 'path';
import nodePlop from '../lib/index.js';

const mockPath = path.resolve(__dirname, 'mock');
const testSrcPath = `${mockPath}/src/generator-name-and-prompts`;
const plop = nodePlop();

///////
// generator name should be defaulted
// runPrompts should reject if there are no prompts
//

test.beforeEach( async t => {
	plop.setGenerator('', {});
	plop.setGenerator('bad-actions-function', { 
		actions: () => {
			'bad actions output';
		}
	});

	const generatorOne = plop.getGenerator('generator-1');
	const generatorBadActions = plop.getGenerator('bad-actions-function');

	t.context.generatorOne = generatorOne;
	t.context.generatorBadActions = generatorBadActions;
});

test('generatorOne should not be able to run the promps (it has none)', async t => {
	const generatorOne = t.context.generatorOne;

	t.is(typeof generatorOne, 'object');

	try {
		await generatorOne.runPrompts();
		t.fail();
	}catch(err){
		t.is(err.message, 'generator-1 does no have prompts.');
	}
});

test('generatorOne should not be able to run the actions (it has one)', async t => {
	const generatorOne = t.context.generatorOne;

	try {
		await generatorOne.runActions();
		t.fail();
	}catch(err){
		t.is(err.message, 'generator-1 does no have actions.');
	}
});

test('bad-actions-function should not be able to run the actions', async t => {
	const generatorBadActions = t.context.generatorBadActions;

	try {
		await generatorBadActions.runActions();
		t.fail();
	}catch(err){
		t.is(err.message, 'bad-actions-function does no have actions.')
	}
});
import fs from 'fs';
import co from 'co';
import path from 'path';
import AvaTest from './_base-ava-test';
const {test, testSrcPath, nodePlop} = (new AvaTest(__filename));

const plop = nodePlop();



plop.setGenerator('add-action-failure', {
	description: 'adds a file using a template',
	actions: [{
		type: 'add',
		path: `${testSrcPath}/{{dashCase name}}.txt`,
		template: '{{name}}'
	}]
});
plop.setGenerator('add-action-failure-skip-exists-false', {
	description: 'adds a file using a template',
	actions: [{
		type: 'add',
		path: `${testSrcPath}/{{dashCase name}}.txt`,
		template: '{{name}}',
		skipIfExists: false
	}]
});
plop.setGenerator('add-action-failure-skip-exists-true', {
	description: 'adds a file using a template',
	actions: [{
		type: 'add',
		path: `${testSrcPath}/{{dashCase name}}.txt`,
		template: '{{name}}',
		skipIfExists: true
	}]
});





test.serial('Check that the file has been created', co.wrap(function*(t) {
	const actionAdd = plop.getGenerator('add-action-failure');
	const result = yield actionAdd.runActions({name: 'test1'});
	const filePath = path.resolve(testSrcPath, 'test1.txt');
	t.is(result.changes.length, 1);
	t.is(result.failures.length, 0);
	t.true(fs.existsSync(filePath));
}));

test.serial('If run twice, should fail due to file already exists', co.wrap(function*(t){
	const actionAdd = plop.getGenerator('add-action-failure');
	const result = yield actionAdd.runActions({name: 'test2'});
	t.is(result.changes.length, 1);
	t.is(result.failures.length, 0);
	const filePath = path.resolve(testSrcPath, 'test2.txt');
	t.true(fs.existsSync(filePath));
	const result2 = yield actionAdd.runActions({name: 'test2'});
	t.is(result2.changes.length, 0);
	t.is(result2.failures.length, 1);
	t.true(fs.existsSync(filePath));
}));

test.serial('If skipIfExists is false, it should fail also due to file already exists', co.wrap(function*(t){
	const actionAdd = plop.getGenerator('add-action-failure-skip-exists-false');
	const result = yield actionAdd.runActions({name: 'test3'});
	t.is(result.changes.length, 1);
	t.is(result.failures.length, 0);
	const filePath = path.resolve(testSrcPath, 'test3.txt');
	t.true(fs.existsSync(filePath));
	const result2 = yield actionAdd.runActions({name: 'test3'});
	t.is(result2.changes.length, 0);
	t.is(result2.failures.length, 1);
	t.true(fs.existsSync(filePath));
}));

test.serial('If skipIfExists is true, it should not fail', co.wrap(function*(t){
	const actionAdd = plop.getGenerator('add-action-failure-skip-exists-true');
	const result = yield actionAdd.runActions({name: 'test4'});
	t.is(result.changes.length, 1);
	t.is(result.failures.length, 0);
	const filePath = path.resolve(testSrcPath, 'test4.txt');
	t.true(fs.existsSync(filePath));
	const result2 = yield actionAdd.runActions({name: 'test4'});
	t.is(result2.changes.length, 1);
	t.is(result2.failures.length, 0);
	t.true(fs.existsSync(filePath));
}));

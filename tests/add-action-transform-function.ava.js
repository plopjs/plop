import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test';

const { test, testSrcPath, nodePlop } = new AvaTest(__filename);

const plop = nodePlop();

const baseAction = {
	type: 'add',
	template: '{{fileName}}',
	path: `${testSrcPath}/{{fileName}}.txt`
};

test('Add action without transform function', async function(t) {
	const fileName = 'testFile1';
	const filePath = path.resolve(testSrcPath, fileName + '.txt');

	const gen = plop.setGenerator('add-action', { actions: [baseAction] });
	const { changes, failures } = await gen.runActions({ fileName });

	t.true(failures.length === 0, 'action failed');
	t.true(changes.length > 0, 'no action changes');

	t.true(fs.existsSync(filePath), 'file was not created');
	t.is(
		fs.readFileSync(filePath, 'utf8'),
		fileName,
		'file contents are not correct'
	);
});

test('Add action transform function', async function(t) {
	const fileName = 'testFile2';
	const filePath = path.resolve(testSrcPath, fileName + '.txt');

	const gen = plop.setGenerator('add-action', {
		actions: [
			{
				...baseAction,
				transform(templateOutput) {
					return templateOutput.length.toString();
				}
			}
		]
	});
	const { changes, failures } = await gen.runActions({ fileName });

	t.true(failures.length === 0, 'action failed');
	t.true(changes.length > 0, 'no action changes');

	t.true(fs.existsSync(filePath), 'file was not created');
	t.is(
		fs.readFileSync(filePath, 'utf8'),
		fileName.length.toString(),
		'file contents are not correct'
	);
});

test('Add action async transform function', async function(t) {
	const fileName = 'testFile3';
	const filePath = path.resolve(testSrcPath, fileName + '.txt');

	const gen = plop.setGenerator('add-action', {
		actions: [
			{
				...baseAction,
				async transform(templateOutput) {
					return templateOutput.length.toString();
				}
			}
		]
	});
	const { changes, failures } = await gen.runActions({ fileName });

	t.true(failures.length === 0, 'action failed');
	t.true(changes.length > 0, 'no action changes');

	t.true(fs.existsSync(filePath), 'file was not created');
	t.is(
		fs.readFileSync(filePath, 'utf8'),
		fileName.length.toString(),
		'file contents are not correct'
	);
});

test('Add action transform error', async function(t) {
	const fileName = 'testFile4';
	const filePath = path.resolve(testSrcPath, fileName + '.txt');

	const gen = plop.setGenerator('add-action', {
		actions: [
			{
				...baseAction,
				transform() {
					throw 'Whoops!';
				}
			}
		]
	});
	const { changes, failures } = await gen.runActions({ fileName });

	t.true(failures.length > 0, 'action did not fail');
	t.true(changes.length === 0, 'action made changes');

	t.false(fs.existsSync(filePath), 'file was created');
});

test('Add action async transform rejection', async function(t) {
	const fileName = 'testFile5';
	const filePath = path.resolve(testSrcPath, fileName + '.txt');

	const gen = plop.setGenerator('add-action', {
		actions: [
			{
				...baseAction,
				async transform() {
					return Promise.reject('Whoops!');
				}
			}
		]
	});
	const { changes, failures } = await gen.runActions({ fileName });

	t.true(failures.length > 0, 'action did not fail');
	t.true(changes.length === 0, 'action made changes');

	t.false(fs.existsSync(filePath), 'file was created');
});

test('Add action async transform returns undefined', async function(t) {
	const fileName = 'testFile6';
	const filePath = path.resolve(testSrcPath, fileName + '.txt');

	const gen = plop.setGenerator('add-action', {
		actions: [
			{
				...baseAction,
				async transform() {
					return;
				}
			}
		]
	});
	const { changes, failures } = await gen.runActions({ fileName });

	t.true(failures.length > 0, 'action did not fail');
	t.true(changes.length === 0, 'action made changes');

	t.false(fs.existsSync(filePath), 'file was created');
});

test('Add action async transform returns null', async function(t) {
	const fileName = 'testFile7';
	const filePath = path.resolve(testSrcPath, fileName + '.txt');

	const gen = plop.setGenerator('add-action', {
		actions: [
			{
				...baseAction,
				async transform() {
					return null;
				}
			}
		]
	});
	const { changes, failures } = await gen.runActions({ fileName });

	t.true(failures.length > 0, 'action did not fail');
	t.true(changes.length === 0, 'action made changes');

	t.false(fs.existsSync(filePath), 'file was created');
});

test('Add action async transform returns invalid', async function(t) {
	const fileName = 'testFile8';
	const filePath = path.resolve(testSrcPath, fileName + '.txt');

	const gen = plop.setGenerator('add-action', {
		actions: [
			{
				...baseAction,
				async transform() {
					return { a: 'a' };
				}
			}
		]
	});

	const { changes, failures } = await gen.runActions({ fileName });

	t.true(failures.length > 0, 'action did not fail');
	t.true(changes.length === 0, 'action made changes');

	t.false(fs.existsSync(filePath), 'file was created');
});

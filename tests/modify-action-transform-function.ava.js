import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test';

/**
 * We are creating files in each test,
 * but Ava runs tests in parallel by default,
 * which can make the tests unreliable,
 * so we need to implement the these tests with test.serial.
 *
 * Also we need to clean before each test, b/c we are creating files in each test.
 * (AvaTest only cleans once before and after the test file)
 */
const avaTest = new AvaTest(__filename);
const { test, testSrcPath, nodePlop, clean } = avaTest;
test.beforeEach(clean.bind(avaTest));

const plop = nodePlop();

const genName = 'add-then-modify';
const fileName = 'testFile';

const addAction = {
	type: 'add',
	template: `{{fileName}}${genName}`,
	path: `${testSrcPath}/{{fileName}}.txt`
};

const modifyAction = {
	type: 'modify',
	path: addAction.path
};

test.serial('Modify action fails without pattern or transform', async function(
	t
) {
	const filePath = path.resolve(testSrcPath, fileName + '.txt');

	const gen = plop.setGenerator(genName, {
		actions: [addAction, modifyAction]
	});

	const { failures } = await gen.runActions({ fileName });

	t.true(failures.length > 0, 'modify action did not fail');

	t.true(fs.existsSync(filePath), 'file was not created');
	t.is(
		fs.readFileSync(filePath, 'utf8'),
		fileName + genName,
		'file contents are not correct'
	);
});

test.serial('Modify action with standard usage', async function(t) {
	const filePath = path.resolve(testSrcPath, fileName + '.txt');
	const template = 'template1';

	const gen = plop.setGenerator(genName, {
		actions: [
			addAction,
			{ ...modifyAction, pattern: new RegExp(genName), template }
		]
	});
	const { changes, failures } = await gen.runActions({ fileName });

	t.true(failures.length === 0, 'action failed');
	t.true(changes.length > 0, 'no action changes');

	t.true(fs.existsSync(filePath), 'file was not created');

	t.is(
		fs.readFileSync(filePath, 'utf8'),
		fileName + template,
		'file contents are not correct'
	);
});

test.serial('Modify action with both pattern and transform', async function(t) {
	const filePath = path.resolve(testSrcPath, fileName + '.txt');
	const template = 'template2';

	const gen = plop.setGenerator(genName, {
		actions: [
			addAction,
			{
				...modifyAction,
				pattern: new RegExp(genName),
				template,
				transform(templateOutput) {
					t.is(
						templateOutput,
						fileName + template,
						'transform does not receive pattern result'
					);

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
		(fileName + template).length.toString(),
		'file contents are not correct'
	);
});

test.serial('Modify action with transform function only', async function(t) {
	const filePath = path.resolve(testSrcPath, fileName + '.txt');

	const gen = plop.setGenerator(genName, {
		actions: [
			addAction,
			{
				...modifyAction,
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
		(fileName + genName).length.toString(),
		'file contents are not correct'
	);
});

test.serial('Modify action with async transform function', async function(t) {
	const filePath = path.resolve(testSrcPath, fileName + '.txt');

	const gen = plop.setGenerator(genName, {
		actions: [
			addAction,
			{
				...modifyAction,
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
		(fileName + genName).length.toString(),
		'file contents are not correct'
	);
});

test.serial('Modify action with transform error', async function(t) {
	const gen = plop.setGenerator(genName, {
		actions: [
			addAction,
			{
				...modifyAction,
				transform() {
					throw 'Whoops!';
				}
			}
		]
	});
	const { changes, failures } = await gen.runActions({ fileName });

	t.true(failures.length > 0, 'action did not fail');
	t.true(changes.length === 1, 'modify action made changes');
});

test.serial('Modify action with async transform rejection', async function(t) {
	const gen = plop.setGenerator(genName, {
		actions: [
			addAction,
			{
				...modifyAction,
				async transform() {
					return Promise.reject('Whoops!');
				}
			}
		]
	});
	const { changes, failures } = await gen.runActions({ fileName });

	t.true(failures.length > 0, 'action did not fail');
	t.true(changes.length === 1, 'modify action made changes');
});

test.serial(
	'Modify action with async transform returns undefined',
	async function(t) {
		const gen = plop.setGenerator(genName, {
			actions: [
				addAction,
				{
					...modifyAction,
					async transform() {
						return;
					}
				}
			]
		});
		const { changes, failures } = await gen.runActions({ fileName });

		t.true(failures.length > 0, 'action did not fail');
		t.true(changes.length === 1, 'modify action made changes');
	}
);

test.serial('Modify action with async transform returns null', async function(
	t
) {
	const gen = plop.setGenerator(genName, {
		actions: [
			addAction,
			{
				...modifyAction,
				async transform() {
					return null;
				}
			}
		]
	});
	const { changes, failures } = await gen.runActions({ fileName });

	t.true(failures.length > 0, 'action did not fail');
	t.true(changes.length === 1, 'modify action made changes');
});

test.serial(
	'Modify action with async transform returns invalid',
	async function(t) {
		const gen = plop.setGenerator(genName, {
			actions: [
				addAction,
				{
					...modifyAction,
					async transform() {
						return { a: 'a' };
					}
				}
			]
		});

		const { changes, failures } = await gen.runActions({ fileName });

		t.true(failures.length > 0, 'action did not fail');
		t.true(changes.length === 1, 'modify action made changes');
	}
);

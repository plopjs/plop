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
const { test, testSrcPath, nodePlop, mockPath, clean } = avaTest;
test.beforeEach(clean.bind(avaTest));

const plop = nodePlop();

const dataProp = 'testFile';
const filePath1 = path.resolve(testSrcPath, 'file1.txt');
const filePath2 = path.resolve(testSrcPath, 'file2.txt');

const addManyAction = {
	type: 'addMany',
	base: mockPath,
	destination: testSrcPath,
	templateFiles: `${mockPath}/*.hbs`,
	verbose: true
};

test.serial('addMany action without transform function', async t => {
	const gen = plop.setGenerator('addMany-action', { actions: [addManyAction] });
	const { changes, failures } = await gen.runActions({ dataProp });

	t.true(failures.length === 0, 'action failed');
	t.true(changes.length > 0, 'no action changes');

	t.true(fs.existsSync(filePath1), `file not created: ${filePath1}`);
	t.true(fs.existsSync(filePath2), `file not created: ${filePath2}`);

	t.is(
		fs.readFileSync(filePath1, 'utf8'),
		`file1 ${dataProp}`,
		'file contents are not correct'
	);
	t.is(
		fs.readFileSync(filePath2, 'utf8'),
		`file2 ${dataProp}`,
		'file contents are not correct'
	);
});

test.serial('addMany action transform function', async function(t) {
	const gen = plop.setGenerator('addMany-action', {
		actions: [
			{
				...addManyAction,
				transform(templateOutput) {
					return templateOutput.length.toString();
				}
			}
		]
	});
	const { changes, failures } = await gen.runActions({ dataProp });

	t.true(failures.length === 0, 'action failed');
	t.true(changes.length > 0, 'no action changes');

	t.true(fs.existsSync(filePath1), `file not created: ${filePath1}`);
	t.true(fs.existsSync(filePath2), `file not created: ${filePath2}`);

	t.is(
		fs.readFileSync(filePath1, 'utf8'),
		'14',
		'file contents are not correct'
	);
	t.is(
		fs.readFileSync(filePath2, 'utf8'),
		'14',
		'file contents are not correct'
	);
});

test.serial('addMany action async transform function', async function(t) {
	const gen = plop.setGenerator('addMany-action', {
		actions: [
			{
				...addManyAction,
				async transform(templateOutput) {
					return templateOutput.length.toString();
				}
			}
		]
	});
	const { changes, failures } = await gen.runActions({ dataProp });

	t.true(failures.length === 0, 'action failed');
	t.true(changes.length > 0, 'no action changes');

	t.true(fs.existsSync(filePath1), `file not created: ${filePath1}`);
	t.true(fs.existsSync(filePath2), `file not created: ${filePath2}`);

	t.is(
		fs.readFileSync(filePath1, 'utf8'),
		'14',
		'file contents are not correct'
	);
	t.is(
		fs.readFileSync(filePath2, 'utf8'),
		'14',
		'file contents are not correct'
	);
});

test.serial('addMany action transform error', async function(t) {
	const gen = plop.setGenerator('addMany-action', {
		actions: [
			{
				...addManyAction,
				transform() {
					throw 'Whoops!';
				}
			}
		]
	});
	const { changes, failures } = await gen.runActions({ dataProp });

	t.true(failures.length > 0, 'action did not fail');
	t.true(changes.length === 0, 'action made changes');

	t.false(fs.existsSync(filePath1), `file was created: ${filePath1}`);
	t.false(fs.existsSync(filePath2), `file was created: ${filePath2}`);
});

test.serial('addMany action async transform rejection', async function(t) {
	const gen = plop.setGenerator('addMany-action', {
		actions: [
			{
				...addManyAction,
				async transform() {
					return Promise.reject('Whoops!');
				}
			}
		]
	});
	const { changes, failures } = await gen.runActions({ dataProp });

	t.true(failures.length > 0, 'action did not fail');
	t.true(changes.length === 0, 'action made changes');

	t.false(fs.existsSync(filePath1), `file was created: ${filePath1}`);
	t.false(fs.existsSync(filePath2), `file was created: ${filePath2}`);
});

test.serial('addMany action async transform returns undefined', async function(
	t
) {
	const gen = plop.setGenerator('addMany-action', {
		actions: [
			{
				...addManyAction,
				async transform() {
					return;
				}
			}
		]
	});
	const { changes, failures } = await gen.runActions({ dataProp });

	t.true(failures.length > 0, 'action did not fail');
	t.true(changes.length === 0, 'action made changes');

	t.false(fs.existsSync(filePath1), `file was created: ${filePath1}`);
	t.false(fs.existsSync(filePath2), `file was created: ${filePath2}`);
});

test.serial('addMany action async transform returns invalid', async function(
	t
) {
	const gen = plop.setGenerator('addMany-action', {
		actions: [
			{
				...addManyAction,
				async transform() {
					return null;
				}
			}
		]
	});

	const { changes, failures } = await gen.runActions({ dataProp });

	t.true(failures.length === 1, 'action failed');
	t.true(changes.length === 0, 'no items in changes array');

	t.false(fs.existsSync(filePath1), `file was created: ${filePath1}`);
	t.false(fs.existsSync(filePath2), `file was created: ${filePath2}`);
});

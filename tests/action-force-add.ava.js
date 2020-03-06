import * as fspp from '../src/fs-promise-proxy';
import AvaTest from './_base-ava-test';
const {test, testSrcPath, nodePlop} = (new AvaTest(__filename));

/////
// global and local "force" flag that can be used to push through failures
//

test('Action force add (global force)', async function (t) {
	const plop = nodePlop('', {force: true});
	const filePath = `${testSrcPath}/test.txt`;
	const gen = plop.setGenerator('Gen', {
		actions: [{
			type: 'add',
			template: 'initial',
			path: filePath
		}, {
			type: 'add',
			template: 'overwrite',
			path: filePath
		}, {
			type: 'add',
			template: 'success',
			path: filePath,
			force: false // will not be respected due to global flag
		}]
	});

	const {changes, failures} = await gen.runActions({});
	const content = await fspp.readFile(filePath);

	t.is(changes.length, 3);
	t.is(failures.length, 0);
	t.true(await fspp.fileExists(filePath));
	t.is(content, 'success');
});

test('Action force add (local action force)', async function (t) {
	const plop = nodePlop();
	const filePath = `${testSrcPath}/test2.txt`;
	const gen = plop.setGenerator('Gen', {
		actions: [{
			type: 'add',
			template: 'initial',
			path: filePath
		}, {
			type: 'add',
			template: 'failure',
			path: filePath,
			abortOnFail: false
		}, {
			type: 'add',
			template: 'success',
			path: filePath,
			force: true
		}]
	});

	const {changes, failures} = await gen.runActions({});
	const content = await fspp.readFile(filePath);

	t.is(changes.length, 2);
	t.is(failures.length, 1);
	t.true(await fspp.fileExists(filePath));
	t.is(content, 'success');
});

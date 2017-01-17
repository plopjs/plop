import * as fspp from '../src/fs-promise-proxy';
import co from 'co';
import path from 'path';
import AvaTest from './_base-ava-test';
const {test, testSrcPath, nodePlop} = (new AvaTest(__filename));

const plop = nodePlop();

test('Check that an empty file has been created', co.wrap(function* (t) {
	plop.setGenerator('no-template', {
		actions: [{
			type: 'add',
			path: `${testSrcPath}/{{dashCase name}}.txt`
		}]
	});

	const name = 'no-template';
	const results = yield plop.getGenerator(name).runActions({name});
	const {changes, failures} = results;
	const filePath = path.resolve(testSrcPath, `${name}.txt`);
	const content = yield fspp.readFile(filePath);

	t.is(changes.length, 1);
	t.is(failures.length, 0);
	t.true(yield fspp.fileExists(filePath));
	t.is(content, '');
}));

import fs from 'fs';
import co from 'co';
import path from 'path';
import AvaTest from './_base-ava-test';
const {test, mockPath, testSrcPath, nodePlop} = new AvaTest(__filename);

const plop = nodePlop();

test.beforeEach(co.wrap(function* (t) {
	const name = 'add action failure';
	plop.setGenerator('add-action-failure', {
		description: 'adds a file using a template',
		actions: [{
			type: 'add',
			path: `${testSrcPath}/{{dashCase name}}.txt`,
			template: '{{name}}'
		}]
	});

	const actionAdd = plop.getGenerator('add-action-failure');
	t.context = yield actionAdd.runActions({name});
}));

test.serial('Check that the file has been created', t => {
	const result = t.context;
	const filePath = path.resolve(testSrcPath, 'add-action-failure.txt');

	t.is(result.changes.length, 1);
	t.is(result.failures.length, 0);
	t.true(fs.existsSync(filePath));
});

test.serial('Run the add again, should fail due to file already exists', t => {
	const result = t.context;

	t.is(result.changes.length, 0);
	t.is(result.failures.length, 1);
});

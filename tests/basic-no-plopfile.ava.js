import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test';
const {test, testSrcPath, nodePlop} = (new AvaTest(__filename));

const plop = nodePlop();

test.before(() => {
	const name = 'basic test name';
	plop.setHelper('uCase', txt => txt.toUpperCase());
	plop.setGenerator('basic-add-no-plopfile', {
		description: 'adds a file using a template',
		prompts: [{
			type: 'input',
			name: 'name',
			message: 'What is your name?',
			validate: function (value) {
				if ((/.+/).test(value)) { return true; }
				return 'name is required';
			}
		}],
		actions: [{
			type: 'add',
			path: `${testSrcPath}/{{dashCase name}}.txt`,
			template: '{{uCase name}}'
		}]
	});

	const basicAdd = plop.getGenerator('basic-add-no-plopfile');
	return basicAdd.runActions({name});
});

test('Check that the file has been created', t => {
	const filePath = path.resolve(testSrcPath, 'basic-test-name.txt');

	t.true(fs.existsSync(filePath));
});

test('Test the content of the rendered file', t => {
	const filePath = path.resolve(testSrcPath, 'basic-test-name.txt');
	const content = fs.readFileSync(filePath).toString();

	t.true(content === 'BASIC TEST NAME');
});

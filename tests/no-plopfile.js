const fs = require('fs');
const path = require('path');
const nodePlop = require('../lib/index.js');
const mockPath = path.resolve(__dirname, 'mock');
const testSrcPath = `${mockPath}/src`;

module.exports = {
	basic: function (t) {
		const plop = nodePlop();
		const name = 'basic test name';

		plop.addHelper('uCase', txt => txt.toUpperCase());
		plop.setGenerator('basic-add-no-plopfile', {
			description: 'adds a file using a template',
			prompts: [
				{
					type: 'input',
					name: 'name',
					message: 'What is your name?',
					validate: function (value) {
						if ((/.+/).test(value)) { return true; }
						return 'name is required';
					}
				}
			],
			actions: [
				{
					type: 'add',
					path: `${testSrcPath}/{{dashCase name}}.txt`,
					template: '{{uCase name}}'
				}
			]
		});

		const basicAdd = plop.getGenerator('basic-add-no-plopfile');
		return basicAdd.runActions({name})

			// check that the file has been created
			.then(function () {
				t.true(fs.existsSync(path.resolve(testSrcPath, 'basic-test-name.txt')));
			})

			// test the content of the rendered file
			.then(function () {
				const filePath = path.resolve(testSrcPath, 'basic-test-name.txt');
				const content = fs.readFileSync(filePath).toString();

				t.true(content === 'BASIC TEST NAME');
			});
	}
};

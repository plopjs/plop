module.exports = function (plop) {
	'use strict';

	// setGenerator creates a generator that can be run with "plop generatorName"
	plop.setGenerator('dynamic-template-add-many', {
		description: 'adds multiple files using dynamic templates',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What is your name?',
				validate: function (value) {
					if ((/.+/).test(value)) { return true; }
					return 'name is required';
				}
			}, {
				type: 'list',
				name: 'kind',
				message: 'What kind of widget do you want to create?',
				choices: ['LineChart', 'BarChart'],
			}
		],
		actions: [
			{
				type: 'addMany',
				destination: 'src/{{dashCase name}}-{{dashCase kind}}/',
				templateFiles: [
					'plop-templates/{{dashCase kind}}/*',
					'plop-templates/{{dashCase kind}}/helpers/\\{{dashCase name}}.js'
				],
				base: 'plop-templates/{{dashCase kind}}',
				abortOnFail: true
			}
		]
	});
};

module.exports = function (plop) {
	'use strict';

	// setGenerator creates a generator that can be run with "plop generatorName"
	plop.setGenerator('multiple-adds', {
		description: 'adds multiple files from a glob',
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
				type: 'addMany',
				destination: 'src/{{dashCase name}}/',
				templateFiles: 'plop-templates/**/*.txt',
				abortOnFail: true,
				verbose: false
			}
		]
	});
};

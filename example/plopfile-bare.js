module.exports = function (plop) {
	'use strict';

	plop.addHelper('helper', function (text) {
		return text;
	});

	plop.setGenerator('generator', {
		description: 'simple generator',
		prompts: [
			{
				// see here for possible options
				// https://github.com/SBoudrias/Inquirer.js/#objects
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
			// see here for more options
			// https://github.com/amwmedia/plop#actions-array
			{
				type: 'add',
				path: '', // path where file will be added
				templateFile: 'plop-templates/file.txt' // path to the templateFile
			},
			{
				type: 'modify',
				path: '', // path to existing file to modify
				pattern: /.+/gi, // use regex to pick location in file
				template: '' // create a template here, or use a 'templateFile'
			}
		]
	});
};

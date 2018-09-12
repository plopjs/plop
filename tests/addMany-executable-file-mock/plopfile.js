module.exports = function (plop) {
	'use strict';

	// setGenerator creates a generator that can be run with "plop generatorName"
	plop.setGenerator('executable-flag-add-many', {
		description: 'adds multiple files from a glob',
		prompts: [
			{
				type: 'input',
				name: 'executableName',
				message: 'Name of the executable?',
				validate: function (value) {
					if ((/.+/).test(value)) { return true; }
					return 'name is required';
				}
			}
		],
		actions: [{
			type: 'addMany',
			destination: 'src/',
			templateFiles: 'plop-templates/**/*',
			abortOnFail: true
		}]
	});
};


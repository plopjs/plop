'use strict';

module.exports = (plop) => {

	plop.setGenerator('custom-prompt', {
		description: 'custom inquirer prompt example',
		prompts: [
			{
				type: 'input',
				name: 'fileName',
				message: 'Pick a file name:',
				validate: function (value) {
					if ((/.+/).test(value)) { return true; }
					return 'file name is required';
				}
			}, {
				type: 'directory',
				name: 'path',
				message: 'where would you like to put this component?',
				basePath: plop.getPlopfilePath()
			}
		],
		actions: [
			{
				type: 'add',
				path: '{{path}}/{{fileName}}.txt',
				template: '{{path}}/{{fileName}} plopped!'
			}
		]
	});

};

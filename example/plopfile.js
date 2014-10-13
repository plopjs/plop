module.exports = function (plop) {
	'use strict';
	plop.addHelper('dashAround', function (text) {
		return '---- ' + text + ' ----';
	});

	plop.setGenerator('test', {
		prompts: {
			'name': {
				'description': 'What is your name?',
				'message': 'Name is required'
			},
			'age': {
				'description': 'How old are you?',
				'pattern': /[0-9]+/gi,
				'message': 'Age must be a number.'
			}
		},
		actions: [
			{
				type: 'add',
				path: 'folder/{{dashCase name}}.txt',
				templateFile: 'templates/temp.txt',
				abortOnFail: true
			},{
				type: 'modify',
				path: 'change-me.txt',
				pattern: /(-- APPEND ITEMS HERE --)/gi,
				template: '$1\r\n{{name}}: {{age}}'
			},{
				type: 'modify',
				path: 'change-me.txt',
				pattern: /(-- PREPEND ITEMS HERE --)/gi,
				templateFile: 'templates/part.txt'
			},{
				type: 'modify',
				path: 'change-me.txt',
				pattern: /## replace name here ##/gi,
				template: 'replaced => {{dashCase name}}'
			}
		]
	});
};
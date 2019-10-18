module.exports = function (plop) {
	'use strict';

	plop.setGenerator('make-list', {
		prompts: [
			{
				type: 'input',
				name: 'listName',
				message: 'What\'s the list name?',
				validate: function (value) {
					if ((/.+/).test(value)) { return true; }
					return 'name is required';
				}
			}
		],
		actions: [
			{
				type: 'add',
				path: 'src/{{listName}}.txt',
				templateFile: 'plop-templates/list.txt',
			},
		]
	});

	plop.setGenerator('append-to-list', {
		description: 'adds entry to a list',
		prompts: [
			{
				type: 'input',
				name: 'listName',
				message: 'What\'s the list name?',
				validate: function (value) {
					if ((/.+/).test(value)) { return true; }
					return 'name is required';
				}
			},
			{
				type: 'input',
				name: 'name',
				message: 'What is your name?',
				validate: function (value) {
					if ((/.+/).test(value)) { return true; }
					return 'name is required';
				}
			}, {
				type: 'confirm',
				name: 'allowDuplicates',
				message: 'Allow Duplicates?',
			}
		],
		actions: ({allowDuplicates}) => [
			{
				type: 'append',
				path: 'src/{{listName}}.txt',
				pattern: /-- APPEND ITEMS HERE --/gi,
				template: '😻 name: {{name}}1',
				unique: !allowDuplicates
			},
			{
				type: 'append',
				path: 'src/{{listName}}.txt',
				pattern: '/* APPEND OTHER ITEMS HERE */',
				template: '🔥 name: {{name}}2',
				unique: !allowDuplicates
			}
		]
	});
};

module.exports = function (plop) {
	'use strict';

	plop.setGenerator('make-list', {
		actions: [
			{
				type: 'add',
				path: 'src/{{listName}}.txt',
				template: '',
			},
		]
	});

	plop.setGenerator('append-to-list', {
		description: 'adds entry to a list',
		actions: [
			{
				type: 'append',
				path: 'src/{{listName}}.txt',
				template: '{{name}}',
			}
		]
	});
};

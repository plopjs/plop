'use strict';

var process = require('process');

module.exports = (plop) => {

	// setGenerator creates a generator that can be run with "plop generatorName"
	plop.setGenerator('test', {
		description: 'this is a test',
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
				type: 'input',
				name: 'age',
				message: 'How old are you?',
				validate: function (value) {
					var digitsOnly = /\d+/;
					if (digitsOnly.test(value)) { return true; }
					return 'Invalid age! Must be a number genius!';
				}
			}, {
				type: 'checkbox',
				name: 'toppings',
				message: 'What pizza toppings do you like?',
				choices: [
					{name: 'Cheese', value: 'cheese', checked: true},
					{name: 'Pepperoni', value: 'pepperoni'},
					{name: 'Pineapple', value: 'pineapple'},
					{name: 'Mushroom', value: 'mushroom'},
					{name: 'Bacon', value: 'bacon', checked: true}
				]
			}
		],
		actions: [
			{
				type: 'add',
				path: 'folder/{{dashCase name}}.txt',
				templateFile: 'templates/temp.txt',
				abortOnFail: true
			},
			function customAction(answers) {
				// move the current working directory to the plop file path
				// this allows this action to work even when the generator is
				// executed from inside a subdirectory
				process.chdir(plop.getPlopfilePath());

				// custom function can be synchronous or async (by returning a promise)
				var fs = require('fs'),
					existsMsg = 'psst {{name}}, change-me.txt already exists',
					copiedMsg = 'hey {{name}}, I copied change-me.txt for you',
					changeFile = 'change-me.txt';

				// you can use plop.renderString to render templates
				existsMsg = plop.renderString(existsMsg, answers);
				copiedMsg = plop.renderString(copiedMsg, answers);

				if (fs.existsSync(changeFile)) {
					// returned value shows up in the console
					return existsMsg;
				} else {
					// do a synchronous copy via node fs
					fs.writeFileSync(changeFile, fs.readFileSync('templates/' + changeFile));
					return copiedMsg;
				}
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

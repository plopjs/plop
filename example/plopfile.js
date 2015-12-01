module.exports = function (plop) {
	'use strict';

	// helpers are passed through to handlebars and made
	// available for use in the generator templates

	// adds 4 dashes around some text
	plop.addHelper('dashAround', function (text) {
		return '---- ' + text + ' ----';
	});

	// formats an array of options like you would write
	// it if you were speaking (one, two, and three)
	plop.addHelper('wordJoin', function (words) {
		return words.join(', ').replace(/(:?.*),/, '$1, and');
	});

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
					{name: 'Peperonni', value: 'peperonni'},
					{name: 'Pineapple', value: 'pineapple'},
					{name: 'Mushroom', value: 'mushroom'},
					{name: 'Bacon', value: 'bacon'}
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

	// test with dynamic actions, regarding responses to prompts
	plop.setGenerator('test with dynamic actions', {
		description: 'this is another test',
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
				type: 'confirm',
				name: 'hasPotatoes',
				message: 'Do you want potatoes with your burger?'
			}
		],
		actions: function(data) {
			var actions = [
				{
					type: 'add',
					path: 'folder/{{dashCase name}}-burger.txt',
					templateFile: 'templates/burger.txt',
					abortOnFail: true
				}
			];

			if(data.hasPotatoes) {
				actions = actions.concat([
					{
						type: 'add',
						path: 'folder/{{dashCase name}}-potatoes.txt',
						templateFile: 'templates/potatoes.txt',
						abortOnFail: true
					},{
						type: 'modify',
						path: 'folder/{{dashCase name}}-burger.txt',
						pattern: /(!\n)/gi,
						template: '$1Your potatoes: {{dashCase name}}-potatoes.txt'
					}
				]);
			}

			return actions;
		}
	});
};

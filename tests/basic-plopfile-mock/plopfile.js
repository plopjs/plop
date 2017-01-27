module.exports = function (plop) {
	'use strict';

	///////
	// helpers are passed through to handlebars and made
	// available for use in the generator templates
	//

	// adds 4 dashes around some text (yes es6/es2015 is supported)
	plop.setHelper('dashAround', function (text) { return '---- ' + text + ' ----'; });
	// plop.setHelper('dashAround', (text) => '---- ' + text + ' ----');

	// formats an array of options like you would write
	// it if you were speaking (one, two, and three)
	plop.setHelper('wordJoin', function (words) {
		return words.join(', ').replace(/(:?.*),/, '$1, and');
	});

	// greet the user using a partial
	plop.setPartial('salutation', 'my name is {{ properCase name }} and I am {{ age }}.');


	// setGenerator creates a generator that can be run with "plop generatorName"
	plop.setGenerator('basic-add', {
		description: 'adds a file using a template',
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
			}
		],
		actions: [
			{
				type: 'add',
				path: 'src/{{dashCase name}}.txt',
				templateFile: 'plop-templates/add.txt',
				abortOnFail: true
			}, {
				type: 'add',
				path: 'src/_{{constantCase name}}.txt',
				template: 'test: {{pkg "name"}}\npropertyPathTest: {{pkg "config.nested[1]"}}\ninline template: {{name}}',
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
					fs.writeFileSync(`src/${changeFile}`, fs.readFileSync(`plop-templates/${changeFile}`));
					return copiedMsg;
				}
			},{
				type: 'modify',
				path: 'src/change-me.txt',
				pattern: /(-- APPEND ITEMS HERE --)/gi,
				template: '$1\r\n{{name}}: {{age}}'
			},{
				type: 'modify',
				path: 'src/change-me.txt',
				pattern: /(-- PREPEND ITEMS HERE --)/gi,
				templateFile: 'plop-templates/part.txt'
			},{
				type: 'modify',
				path: 'src/change-me.txt',
				pattern: /## replace name here ##/gi,
				template: 'replaced => {{dashCase name}}'
			}
		]
	});
};

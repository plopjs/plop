module.exports = function (plop) {
	'use strict';

	// adds 4 dashes around some text (yes es6/es2015 is supported)
	plop.setHelper('surround', (text) => '---- ' + text + ' ----');

	// setGenerator creates a generator that can be run with "plop generatorName"
	plop.setGenerator('basic-add', {
		actions: [{
			type: 'add',
			path: 'src/{{dashCase name}}.txt',
			templateFile: 'plop-templates/test.txt',
		}]
	});

	plop.load('./nested/nested-plopfile.js');
};

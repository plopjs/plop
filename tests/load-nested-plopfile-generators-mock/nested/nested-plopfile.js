module.exports = function (plop) {
	'use strict';

	// adds 4 dashes around some text (yes es6/es2015 is supported)
	plop.setHelper('surround', (text) => '##### ' + text + ' #####');

	// setGenerator creates a generator that can be run with "plop generatorName"
	plop.setGenerator('basic-nested', {
		actions: [{
			type: 'add',
			path: 'src/nested-{{dashCase name}}.txt',
			templateFile: 'plop-templates/nested-test.txt',
		}]
	});


};

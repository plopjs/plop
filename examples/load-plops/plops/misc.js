'use strict';

module.exports = (plop) => {

	// helpers are passed through to handlebars and made
	// available for use in the generator templates

	// adds 4 dashes around some text (yes es6/es2015 is supported)
	plop.addHelper('dashAround', (text) => '---- ' + text + ' ----');

	// formats an array of options like you would write
	// it if you were speaking (one, two, and three)
	plop.addHelper('wordJoin', function (words) {
		return words.join(', ').replace(/(:?.*),/, '$1, and');
	});

	// greet the user using a partial
	plop.addPartial('salutation', '{{ greeting }}, my name is {{ properCase name }} and I am {{ age }}.');





	// adding a custom inquirer prompt type
	plop.addPrompt('directory', require('inquirer-directory'));

};
